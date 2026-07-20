import { Clock, Search, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const history = [
  { date: "2024-03-25", drug: "Metformin", herb: "Ashwagandha", result: "caution" as const, by: "Self" },
  { date: "2024-03-23", drug: "Glimepiride", herb: "Karela juice", result: "avoid" as const, by: "Doctor" },
  { date: "2024-03-20", drug: "Metformin", herb: "Triphala", result: "safe" as const, by: "Self" },
  { date: "2024-03-18", drug: "Glimepiride", herb: "Guduchi", result: "safe" as const, by: "Doctor" },
];

const badgeColors = {
  safe: "bg-safe/10 text-safe border-safe/30",
  caution: "bg-caution/10 text-caution border-caution/30",
  avoid: "bg-avoid/10 text-avoid border-avoid/30",
};

const PatientHistory = () => (
  <DashboardLayout role="patient">
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Clock size={24} className="text-primary" /> Interaction History</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Report exported!")} className="gap-1.5">
            <Download size={14} /> Export PDF
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search history..." className="pl-9" />
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
              {history.map((h, i) => (
                <TableRow key={i} className="cursor-pointer hover:bg-accent/50">
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

export default PatientHistory;
