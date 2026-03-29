import { Users, Database, ScrollText, BarChart2, MessageSquareWarning, Settings2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

const Placeholder = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <DashboardLayout role="admin">
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/admin/home" />
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

export const AdminUsers = () => <Placeholder title="User Management" icon={Users} />;
export const AdminMedicines = () => <Placeholder title="Medicine Database" icon={Database} />;
export const AdminLogs = () => <Placeholder title="Audit Logs" icon={ScrollText} />;
export const AdminAnalytics = () => <Placeholder title="Analytics" icon={BarChart2} />;
export const AdminFeedback = () => <Placeholder title="Feedback Review" icon={MessageSquareWarning} />;
export const AdminSettings = () => <Placeholder title="System Settings" icon={Settings2} />;
