import { motion } from "framer-motion";
import { Users, Activity, AlertTriangle, FileText, Plus, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const cards = [
  { label: "Total Patients", value: "24", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Checks Today", value: "7", icon: Activity, color: "bg-secondary/30 text-secondary-foreground" },
  { label: "High Risk Alerts", value: "3", icon: AlertTriangle, color: "bg-avoid/10 text-avoid" },
  { label: "Reports Generated", value: "12", icon: FileText, color: "bg-safe/10 text-safe" },
];

const recentPatients = [
  { name: "Arjun Sharma", age: 28, risk: false, lastVisit: "2024-03-25" },
  { name: "Meera Patel", age: 55, risk: true, lastVisit: "2024-03-24" },
  { name: "Ravi Kumar", age: 42, risk: false, lastVisit: "2024-03-23" },
  { name: "Sunita Devi", age: 60, risk: true, lastVisit: "2024-03-22" },
  { name: "Amit Joshi", age: 35, risk: false, lastVisit: "2024-03-20" },
];

const recentAlerts = [
  { patient: "Meera Patel", desc: "Karela + Glimepiride — high risk", time: "2h ago" },
  { patient: "Sunita Devi", desc: "Ashwagandha + Insulin — monitor closely", time: "5h ago" },
  { patient: "Ravi Kumar", desc: "Neem + Metformin — potential interaction", time: "1d ago" },
];

const DoctorHome = () => (
  <DashboardLayout role="doctor">
    <PageTransition>
      <div className="space-y-8">
        <div className="botanical-bg rounded-2xl p-8 border border-border flex items-center justify-between flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <h1 className="text-3xl font-heading font-bold text-foreground mt-1">Welcome back, Dr. Priya 🌿</h1>
          </motion.div>
          <Link to="/doctor/patients">
            <Button className="gradient-gold text-secondary-foreground font-semibold gap-2">
              <Plus size={16} /> Add New Patient
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
            <div className="space-y-3">
              {recentPatients.map((p) => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Age {p.age} • {p.lastVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.risk && <Badge className="bg-avoid/10 text-avoid border-avoid/30 text-xs">Risk</Badge>}
                    <Link to="/doctor/patients">
                      <Button size="sm" variant="ghost" className="text-xs">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4"><AlertTriangle size={18} className="text-avoid" /> Recent Alerts</h2>
            <div className="space-y-3">
              {recentAlerts.map((a, i) => (
                <div key={i} className="border-l-4 border-l-avoid bg-avoid/5 rounded-lg p-3">
                  <p className="text-sm font-medium">{a.patient}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default DoctorHome;
