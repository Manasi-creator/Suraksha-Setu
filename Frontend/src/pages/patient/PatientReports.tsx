import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generatePatientReport } from "@/lib/pdfGenerator";
import { useAuth } from "@/hooks/useAuth";

interface ReportCard {
  id: string;
  title: string;
  date: string;
  doctor: string;
}

const PatientReports = () => {
  const { user, fetchWithAuth } = useAuth();
  const [patientData, setPatientData] = useState<any>(null);
  const [meds, setMeds] = useState<{ modern: any[]; ayurvedic: any[] }>({ modern: [], ayurvedic: [] });
  const [reports, setReports] = useState<ReportCard[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const pRes = await fetchWithAuth(`/api/patients/${user.id}`);
        if (pRes.ok) {
          const pData = await pRes.json();
          setPatientData(pData);
        }
        const mRes = await fetchWithAuth(`/api/medications/patient/${user.id}`);
        if (mRes.ok) {
          const mData = await mRes.json();
          setMeds(mData);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, [user, fetchWithAuth]);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toLocaleDateString("en-IN");
    const doctorName = patientData?.assignedDoctor || user.name || "Your doctor";
    setReports([
      { id: "profile-summary", title: "Current Profile Summary", date: today, doctor: doctorName },
      { id: "medication-review", title: "Medication Review Report", date: today, doctor: doctorName }
    ]);
  }, [user, patientData]);

  const handleDownload = (reportTitle: string, doctorName: string) => {
    const pData = patientData || { name: user?.name || "Patient", assignedDoctor: doctorName };
    generatePatientReport(pData, meds, reportTitle);
    toast.success("Report downloaded!");
  };

  return (
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
                  <Button size="sm" variant="outline" className="mt-3 gap-1.5" onClick={() => handleDownload(r.title, r.doctor)}>
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
};

export default PatientReports;
