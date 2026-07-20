import { motion } from "framer-motion";
import { Pill, Bell, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

const cards = [
  { label: "Active Medications", value: "4", icon: Pill, color: "bg-primary/10 text-primary" },
  { label: "Unread Alerts", value: "3", icon: Bell, color: "bg-destructive/10 text-destructive" },
  { label: "Last Check", value: "2 days ago", icon: Clock, color: "bg-secondary/30 text-secondary-foreground" },
];

const recentAlerts = [
  { id: 1, title: "Potential interaction detected", desc: "Ashwagandha + Metformin may cause hypoglycemia", severity: "caution", time: "2h ago" },
  { id: 2, title: "New medication added", desc: "Dr. Mehta added Triphala to your regimen", severity: "safe", time: "1d ago" },
  { id: 3, title: "High risk combination", desc: "Karela juice with Glimepiride — monitor blood sugar closely", severity: "avoid", time: "3d ago" },
];

const severityColors: Record<string, string> = {
  safe: "border-l-safe bg-safe/5",
  caution: "border-l-caution bg-caution/5",
  avoid: "border-l-avoid bg-avoid/5",
};

const PatientHome = () => (
  <DashboardLayout role="patient">
    <PageTransition>
      <div className="space-y-8">
        {/* Greeting */}
        <div className="botanical-bg rounded-2xl p-8 border border-border">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <h1 className="text-3xl font-heading font-bold text-foreground mt-1">Good morning, Arjun 🌿</h1>
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
          <div className="space-y-3">
            {recentAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`border-l-4 rounded-lg p-4 ${severityColors[alert.severity]}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{alert.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default PatientHome;
