import { Bell, Check } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const alerts = [
  { id: 1, title: "High risk: Karela + Glimepiride", desc: "This combination may cause dangerous hypoglycemia. Avoid consuming Karela juice while on Glimepiride.", severity: "avoid" as const, time: "2h ago", read: false },
  { id: 2, title: "Moderate risk: Ashwagandha + Metformin", desc: "Ashwagandha may enhance the blood-sugar-lowering effect of Metformin. Monitor glucose levels.", severity: "caution" as const, time: "1d ago", read: false },
  { id: 3, title: "Safe combination confirmed", desc: "Triphala and Metformin show no significant interactions in current research.", severity: "safe" as const, time: "3d ago", read: true },
  { id: 4, title: "New medication added by Dr. Mehta", desc: "Guduchi tablet 500mg has been added to your Ayurvedic regimen.", severity: "safe" as const, time: "5d ago", read: true },
];

const sevColors = { safe: "border-l-safe", caution: "border-l-caution", avoid: "border-l-avoid" };

const PatientAlerts = () => (
  <DashboardLayout role="patient">
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/home" />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Bell size={24} className="text-primary" /> Alerts & Notifications</h1>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="high">High Risk</TabsTrigger>
          </TabsList>

          {["all", "unread", "high"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
              {alerts
                .filter((a) => tab === "all" ? true : tab === "unread" ? !a.read : a.severity === "avoid")
                .map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-l-4 ${sevColors[alert.severity]} bg-card rounded-lg p-4 shadow-sm border border-border flex items-start justify-between`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {!alert.read && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                        <h3 className="font-medium">{alert.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.desc}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    {!alert.read && (
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Marked as read")} className="shrink-0">
                        <Check size={14} className="mr-1" /> Read
                      </Button>
                    )}
                  </motion.div>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default PatientAlerts;
