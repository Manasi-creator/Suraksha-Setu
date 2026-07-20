import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pill, Bell, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AlertItem {
  _id: string;
  severity: "High Risk" | "Caution" | "Info";
  message: string;
  sentBy: string;
  status: "Read" | "Unread";
  date: string;
}

const severityColors: Record<string, string> = {
  "High Risk": "border-l-avoid bg-avoid/5",
  "Caution": "border-l-caution bg-caution/5",
  "Info": "border-l-safe bg-safe/5",
};

const PatientHome = () => {
  const { user, fetchWithAuth } = useAuth();
  const [medCount, setMedCount] = useState(0);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch Medications
        const medRes = await fetchWithAuth(`/api/medications/patient/${user.id}`);
        if (medRes.ok) {
          const medData = await medRes.json();
          setMedCount((medData.modern?.length || 0) + (medData.ayurvedic?.length || 0));
        }

        // Fetch Alerts
        const alertRes = await fetchWithAuth(`/api/alerts/patient/${user.id}`);
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          setAlerts(alertData);
          setUnreadCount(alertData.filter((a: AlertItem) => a.status === "Unread").length);
        }
      } catch (err) {
        console.error("Error fetching patient dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const cards = [
    { label: "Active Medications", value: loading ? "..." : `${medCount}`, icon: Pill, color: "bg-primary/10 text-primary" },
    { label: "Unread Alerts", value: loading ? "..." : `${unreadCount}`, icon: Bell, color: "bg-destructive/10 text-destructive" },
    { label: "Last Check", value: "Today", icon: Clock, color: "bg-secondary/30 text-secondary-foreground" },
  ];

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="space-y-8">
          {/* Greeting */}
          <div className="botanical-bg rounded-2xl p-8 border border-border">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              <h1 className="text-3xl font-heading font-bold text-foreground mt-1">Good morning, {user?.name || "Patient"} 🌿</h1>
              <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
            </motion.div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px -8px hsl(120 20% 15% / 0.12)" }}
                className="bg-card rounded-xl p-6 shadow-card border border-border cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-heading font-bold text-foreground mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <card.icon size={22} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick check CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Link to="/patient/chat">
              <Button size="lg" className="gradient-gold text-secondary-foreground font-semibold shadow-lg hover:shadow-xl transition-shadow gap-2">
                <MessageCircle size={18} /> Quick Interaction Check
              </Button>
            </Link>
          </motion.div>

          {/* Recent alerts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                <Bell size={18} className="text-primary" /> Recent Alerts
              </h2>
              <Link to="/patient/alerts" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert, i) => (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`border-l-4 rounded-lg p-4 ${severityColors[alert.severity] || "border-l-primary bg-muted/5"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{alert.severity.toUpperCase()} Alert</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">Sent by: {alert.sentBy}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {new Date(alert.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent alerts found.</p>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientHome;
