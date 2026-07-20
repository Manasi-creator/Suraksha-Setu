import { useState, useEffect } from "react";
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface AlertItem {
  _id: string;
  patient: { _id: string; name: string };
  severity: "High Risk" | "Caution" | "Info";
  message: string;
  sentBy: string;
  status: "Read" | "Unread";
  date: string;
}

const DoctorAlerts = () => {
  const { fetchWithAuth } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetchWithAuth("/api/alerts/doctor");
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
    fetchAlerts();
  }, [fetchWithAuth]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/alerts/${id}/read`, { method: "PUT" });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: "Read" } : a));
        toast.success("Alert marked as read");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error marking alert as read");
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High Risk": return <ShieldAlert className="text-avoid" size={20} />;
      case "Caution": return <AlertTriangle className="text-caution" size={20} />;
      case "Info": return <CheckCircle2 className="text-safe" size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High Risk": return "border-avoid bg-avoid/5";
      case "Caution": return "border-caution bg-caution/5";
      case "Info": return "border-safe bg-safe/5";
      default: return "border-border bg-card";
    }
  };

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BackButton to="/doctor/home" />
              <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Bell size={24} className="text-primary" /> Active Alerts</h1>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">Loading alerts...</div>
            ) : alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert._id} className={`flex items-start gap-4 p-5 rounded-xl border ${getSeverityColor(alert.severity)} transition-all ${alert.status === "Unread" ? "shadow-md" : "opacity-80"}`}>
                  <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`
                          ${alert.severity === 'High Risk' ? 'text-avoid border-avoid/30 bg-avoid/10' : ''}
                          ${alert.severity === 'Caution' ? 'text-caution border-caution/30 bg-caution/10' : ''}
                          ${alert.severity === 'Info' ? 'text-safe border-safe/30 bg-safe/10' : ''}
                        `}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          Patient: <Link to={`/doctor/patients/${alert.patient._id}`} className="text-primary hover:underline">{alert.patient?.name}</Link>
                        </span>
                        {alert.status === "Unread" && <span className="flex h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(alert.date).toLocaleString("en-IN")}</span>
                    </div>
                    <p className={`text-sm ${alert.status === "Unread" ? "font-medium text-foreground" : "text-muted-foreground"}`}>{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">Source: {alert.sentBy}</p>
                  </div>
                  {alert.status === "Unread" && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(alert._id)} className="shrink-0">
                      Mark Read
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border shadow-card">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-safe opacity-50" />
                <p className="text-lg">No active alerts</p>
                <p className="text-sm">You're all caught up with your patients.</p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorAlerts;
