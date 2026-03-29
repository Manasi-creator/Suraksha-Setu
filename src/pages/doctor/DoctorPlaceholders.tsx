import { Clock, FileText, Bell, Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const PlaceholderPage = ({ title, icon: Icon, role }: { title: string; icon: any; role: "doctor" | "patient" | "admin" }) => (
  <DashboardLayout role={role}>
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to={`/${role}/home`} />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Icon size={24} className="text-primary" /> {title}</h1>
        </div>
        <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-border shadow-card">
          <Icon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Coming soon</p>
          <p className="text-sm mt-1">This section is under development.</p>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export const DoctorHistory = () => <PlaceholderPage title="Interaction History" icon={Clock} role="doctor" />;
export const DoctorReports = () => <PlaceholderPage title="Reports" icon={FileText} role="doctor" />;
export const DoctorAlerts = () => <PlaceholderPage title="Alerts" icon={Bell} role="doctor" />;
export const DoctorSettings = () => <PlaceholderPage title="Settings" icon={Settings} role="doctor" />;
