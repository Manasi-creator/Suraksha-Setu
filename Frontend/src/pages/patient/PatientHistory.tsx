import { useEffect, useState } from "react";
import { Clock, Search, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { generateHistoryReport } from "@/lib/pdfGenerator";
import { useAuth } from "@/hooks/useAuth";

interface HistoryEntry {
  date: string;
  drug: string;
  herb: string;
  result: "safe" | "caution" | "avoid";
  by: string;
}

const badgeColors = {
  safe: "bg-safe/10 text-safe border-safe/30",
  caution: "bg-caution/10 text-caution border-caution/30",
  avoid: "bg-avoid/10 text-avoid border-avoid/30",
};

const PatientHistory = () => {
  const { user, fetchWithAuth } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      try {
        const res = await fetchWithAuth(`/api/interactions/patient/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const mappedHistory = (data.conflicts || []).map((entry: any) => ({
            date: new Date(entry.date || Date.now()).toLocaleDateString("en-IN"),
            drug: entry.modernDrug || "N/A",
            herb: entry.ayurvedic || "N/A",
            result: entry.severity === "Avoid" ? "avoid" : entry.severity === "Caution" ? "caution" : "safe",
            by: "AI Check"
          }));
          setHistory(mappedHistory);
        }
      } catch (err) {
        console.error("Error fetching interaction history:", err);
      }
    };

    loadHistory();
  }, [user, fetchWithAuth]);

  const filteredHistory = history.filter((entry) => {
    const query = search.toLowerCase();
    return entry.drug.toLowerCase().includes(query) || entry.herb.toLowerCase().includes(query) || entry.result.toLowerCase().includes(query);
  });

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BackButton to="/patient/home" />
              <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Clock size={24} className="text-primary" /> Interaction History</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              generateHistoryReport(history);
              toast.success("Report exported!");
            }} className="gap-1.5">
              <Download size={14} /> Export PDF
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search history..." className="pl-9" />
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Modern Drug</TableHead>
                  <TableHead>Ayurvedic</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Checked By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((h, i) => (
                  <TableRow key={`${h.date}-${h.drug}-${i}`} className="cursor-pointer hover:bg-accent/50">
                    <TableCell>{h.date}</TableCell>
                    <TableCell className="font-medium">{h.drug}</TableCell>
                    <TableCell>{h.herb}</TableCell>
                    <TableCell><Badge className={badgeColors[h.result]}>{h.result.charAt(0).toUpperCase() + h.result.slice(1)}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{h.by}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientHistory;
