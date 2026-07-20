import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Activity, AlertTriangle, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface PatientItem {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
  status: "Active" | "Inactive";
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  profileCompletion: number;
}

interface AlertItem {
  _id: string;
  severity: string;
  message: string;
  sentBy: string;
  status: string;
  date: string;
  patient?: { name?: string; email?: string };
}

const DoctorHome = () => {
  const { user, fetchWithAuth } = useAuth();
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const patientRes = await fetchWithAuth("/api/patients");
        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatients(patientData);
        }

        const alertRes = await fetchWithAuth("/api/alerts/doctor");
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          setAlerts(alertData);
        }
      } catch (err) {
        console.error("Error fetching doctor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, fetchWithAuth]);

  const todayAlerts = alerts.filter((alert) => {
    const alertDate = new Date(alert.date);
    const today = new Date();
    return alertDate.getFullYear() === today.getFullYear() && alertDate.getMonth() === today.getMonth() && alertDate.getDate() === today.getDate();
  }).length;

  const highRiskAlerts = alerts.filter((alert) => alert.severity === "High Risk").length;
  const recentAlerts = alerts.slice(0, 3).map((alert) => ({
    patient: alert.patient?.name || "Patient",
    desc: alert.message,
    time: new Date(alert.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }));

  const cards = [
    { label: "Assigned Patients", value: loading ? "..." : `${patients.length}`, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Checks Today", value: loading ? "..." : `${todayAlerts}`, icon: Activity, color: "bg-secondary/30 text-secondary-foreground" },
    { label: "High Risk Alerts", value: loading ? "..." : `${highRiskAlerts}`, icon: AlertTriangle, color: "bg-avoid/10 text-avoid" },
    { label: "Reports Generated", value: loading ? "..." : `${Math.max(patients.length, 1)}`, icon: FileText, color: "bg-safe/10 text-safe" },
  ];

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="space-y-8">
          <div className="botanical-bg rounded-2xl p-8 border border-border flex items-center justify-between flex-wrap gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              <h1 className="text-3xl font-heading font-bold text-foreground mt-1">Welcome back, {user?.name || "Doctor"} 🌿</h1>
            </motion.div>
            <Link to="/doctor/patients">
              <Button className="gradient-gold text-secondary-foreground font-semibold gap-2">
                <Plus size={16} /> View Patient List
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-heading font-bold mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <card.icon size={22} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4"><Users size={18} className="text-primary" /> Recent Patients</h2>
              {loading ? (
                <div className="text-center py-6 text-muted-foreground">Loading patients...</div>
              ) : patients.length > 0 ? (
                <div className="space-y-3">
                  {patients.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {p.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.age ? `Age ${p.age}` : "Age not specified"} • {p.gender || "Gender not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.status === "Inactive" && <Badge variant="outline" className="text-xs">Inactive</Badge>}
                        <Link to={`/doctor/patients/${p.id}`}>
                          <Button size="sm" variant="ghost" className="text-xs">View Detail</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No patients assigned to you yet.</p>
              )}
            </div>

            <div className="bg-card rounded-xl shadow-card border border-border p-6">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4"><AlertTriangle size={18} className="text-avoid" /> Recent Alerts</h2>
              <div className="space-y-3">
                {recentAlerts.length > 0 ? recentAlerts.map((a, i) => (
                  <div key={i} className="border-l-4 border-l-avoid bg-avoid/5 rounded-lg p-3">
                    <p className="text-sm font-medium">{a.patient}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No alerts available right now.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorHome;
