import { useState, useEffect } from "react";
import { Pill, Info } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";

interface MedItem {
  _id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  timing: string[];
  notes?: string;
}

const MedTable = ({ title, data }: { title: string; data: MedItem[] }) => (
  <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
    <div className="px-6 py-4 border-b border-border">
      <h3 className="font-heading font-semibold text-lg flex items-center gap-2"><Pill size={18} className="text-primary" /> {title}</h3>
    </div>
    {data.length ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicine</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Timing</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((med) => (
            <TableRow key={med._id}>
              <TableCell className="font-medium">{med.medicine}</TableCell>
              <TableCell>{med.dosage}</TableCell>
              <TableCell>{med.frequency}</TableCell>
              <TableCell>{med.timing?.join(", ") || ""}</TableCell>
              <TableCell className="text-muted-foreground">{med.notes || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <div className="p-8 text-center text-muted-foreground">Your doctor hasn't added any medications in this section yet.</div>
    )}
  </div>
);

const PatientMedications = () => {
  const { user, fetchWithAuth } = useAuth();
  const [modernMeds, setModernMeds] = useState<MedItem[]>([]);
  const [ayurvedicMeds, setAyurvedicMeds] = useState<MedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMedications = async () => {
      try {
        const res = await fetchWithAuth(`/api/medications/patient/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setModernMeds(data.modern || []);
          setAyurvedicMeds(data.ayurvedic || []);
        }
      } catch (err) {
        console.error("Error fetching medications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Pill size={24} className="text-primary" /> My Medications</h1>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={16} className="text-primary shrink-0" />
            This information is managed by your doctor. Contact them for any changes.
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading medications...</div>
          ) : (
            <>
              <MedTable title="Modern Medicines" data={modernMeds} />
              <MedTable title="Ayurvedic Formulations" data={ayurvedicMeds} />
            </>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientMedications;
