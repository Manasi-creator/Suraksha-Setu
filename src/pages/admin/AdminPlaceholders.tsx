import { ScrollText } from "lucide-react";
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

export const AdminLogs = () => <Placeholder title="Audit Logs" icon={ScrollText} />;
