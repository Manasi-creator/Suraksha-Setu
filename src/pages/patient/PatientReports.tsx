import { FileText, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const reports = [
  { id: 1, title: "Monthly Interaction Summary", date: "2024-03-01", doctor: "Dr. Priya Mehta" },
  { id: 2, title: "Medication Review Report", date: "2024-02-15", doctor: "Dr. Priya Mehta" },
];

const PatientReports = () => (
  <DashboardLayout role="patient">
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/home" />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><FileText size={24} className="text-primary" /> My Reports</h1>
        </div>

        {reports.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r) => (
              <div key={r.id} className="bg-card rounded-xl shadow-card border border-border p-5">
                <FileText size={20} className="text-primary mb-2" />
                <h3 className="font-heading font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.date} • {r.doctor}</p>
                <Button size="sm" variant="outline" className="mt-3 gap-1.5" onClick={() => toast.success("Report downloaded!")}>
                  <Download size={14} /> Download PDF
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p>No reports yet.</p>
          </div>
        )}
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default PatientReports;
