import { useState, useEffect } from "react";
import { Clock, Search, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface InteractionHistoryItem {
  patientId: string;
  patientName: string;
  modernDrug: string;
  ayurvedic: string;
  severity: string;
  message: string;
  confidence: number;
  date: string;
}

const DoctorHistory = () => {
  const { fetchWithAuth } = useAuth();
  const [history, setHistory] = useState<InteractionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetchWithAuth("/api/interactions/doctor");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [fetchWithAuth]);

  const filteredHistory = history.filter(
    h => h.patientName.toLowerCase().includes(search.toLowerCase()) || 
         h.modernDrug.toLowerCase().includes(search.toLowerCase()) || 
         h.ayurvedic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/doctor/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Clock size={24} className="text-primary" /> Interaction History</h1>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-heading font-semibold">Patient Interaction Conflicts</h2>
                <p className="text-sm text-muted-foreground">Review system-flagged drug interactions across all your assigned patients.</p>
              </div>
              <div className="relative max-w-sm w-full sm:w-auto">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drug or patient..." className="pl-9" />
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading history...</div>
              ) : filteredHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Modern Medicine</TableHead>
                      <TableHead>Ayurvedic Formulation</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead className="w-1/3">Reasoning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((h, i) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-nowrap">{new Date(h.date).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell className="font-medium">{h.patientName}</TableCell>
                        <TableCell>{h.modernDrug}</TableCell>
                        <TableCell>{h.ayurvedic}</TableCell>
                        <TableCell>
                          <Badge className={h.severity === "Avoid" ? "bg-avoid/10 text-avoid border-avoid/30" : "bg-caution/10 text-caution border-caution/30"}>
                            {h.severity === "Avoid" && <AlertTriangle size={12} className="mr-1" />}
                            {h.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{h.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">No recorded interactions found matching your search.</div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorHistory;
