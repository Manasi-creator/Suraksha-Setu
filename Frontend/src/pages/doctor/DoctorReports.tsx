import { useState, useEffect } from "react";
import { FileText, Download, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { generatePatientReport } from "@/lib/pdfGenerator";

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
}

const DoctorReports = () => {
  const { user, fetchWithAuth } = useAuth();
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetchWithAuth("/api/patients");
        if (res.ok) {
          const data = await res.json();
          setPatients(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [fetchWithAuth]);

  const handleGenerateReport = async (patient: PatientItem) => {
    try {
      toast.info(`Generating report for ${patient.name}...`);
      const res = await fetchWithAuth(`/api/medications/patient/${patient.id}`);
      if (res.ok) {
        const meds = await res.json();
        generatePatientReport(patient, meds, "Comprehensive Interaction Report");
      } else {
        toast.error("Failed to fetch patient medications");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred generating the report");
    }
  };

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/doctor/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <FileText size={24} className="text-primary" /> Reports
            </h1>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <h2 className="text-lg font-heading font-semibold mb-4">Generate Patient Reports</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Select a patient to generate a comprehensive PDF report containing their profile information, current medications, and interaction check results.
            </p>
            
            <div className="relative max-w-sm mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="pl-9" />
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
            ) : filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:border-primary/30 transition-colors">
                    <div>
                      <h3 className="font-medium">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                    <Button size="sm" onClick={() => handleGenerateReport(p)} className="gap-2">
                      <Download size={14} /> Generate PDF
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">No patients found.</div>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorReports;
