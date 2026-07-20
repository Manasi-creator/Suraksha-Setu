import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AlertItem {
  _id: string;
  severity: "High Risk" | "Caution" | "Info";
  message: string;
  sentBy: string;
  status: "Read" | "Unread";
  date: string;
}

const sevColors: Record<string, string> = {
  "High Risk": "border-l-avoid bg-avoid/5",
  "Caution": "border-l-caution bg-caution/5",
  "Info": "border-l-safe bg-safe/5",
};

const PatientAlerts = () => {
  const { user, fetchWithAuth } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    if (!user) return;
    try {
      const res = await fetchWithAuth(`/api/alerts/patient/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/alerts/${id}/read`, {
        method: "PUT"
      });
      if (res.ok) {
        toast.success("Notification read");
        // Update local state
        setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: "Read" } : a));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Bell size={24} className="text-primary" /> Alerts & Notifications</h1>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading alerts...</div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({alerts.filter(a => a.status === "Unread").length})</TabsTrigger>
                <TabsTrigger value="high">High Risk ({alerts.filter(a => a.severity === "High Risk").length})</TabsTrigger>
              </TabsList>

              {["all", "unread", "high"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                  {alerts
                    .filter((a) => {
                      if (tab === "all") return true;
                      if (tab === "unread") return a.status === "Unread";
                      return a.severity === "High Risk";
                    })
                    .map((alert, i) => (
                      <motion.div
                        key={alert._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border-l-4 ${sevColors[alert.severity] || "border-l-primary bg-card"} rounded-lg p-4 shadow-sm border border-border flex items-start justify-between`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            {alert.status === "Unread" && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                            <h3 className="font-medium">{alert.severity.toUpperCase()} ALERT</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} • Sent by: {alert.sentBy}
                          </span>
                        </div>
                        {alert.status === "Unread" && (
                          <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(alert._id)} className="shrink-0">
                            <Check size={14} className="mr-1" /> Read
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  {alerts.filter((a) => {
                    if (tab === "all") return true;
                    if (tab === "unread") return a.status === "Unread";
                    return a.severity === "High Risk";
                  }).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">No notifications found under this tab.</div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientAlerts;
