import { useState } from "react";
import { MessageSquareWarning, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { mockFeedback, type FeedbackEntry } from "@/data/mockData";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(mockFeedback);
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");

  const filtered = feedback.filter(f => {
    if (statusFilter !== "All" && f.status !== statusFilter) return false;
    if (doctorFilter !== "All" && f.doctor !== doctorFilter) return false;
    return true;
  });

  const markReviewed = (id: string) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: "Reviewed" as const } : f));
    toast.success("Feedback marked as reviewed");
  };

  const statusBadge = (s: string) => {
    if (s === "Reviewed") return <Badge className="bg-safe/10 text-safe border-safe/30">Reviewed</Badge>;
    if (s === "Escalated") return <Badge className="bg-avoid/10 text-avoid border-avoid/30">Escalated</Badge>;
    return <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">Pending</Badge>;
  };

  const doctors = [...new Set(mockFeedback.map(f => f.doctor))];

  return (
    <DashboardLayout role="admin">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/admin/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><MessageSquareWarning size={24} className="text-primary" /> Feedback Review</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Doctors</SelectItem>
                {doctors.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="hidden md:table-cell">Patient</TableHead>
                  <TableHead className="hidden lg:table-cell">Drugs Checked</TableHead>
                  <TableHead>AI Result</TableHead>
                  <TableHead className="hidden md:table-cell">Assessment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="text-sm">{f.date}</TableCell>
                    <TableCell className="text-sm font-medium">{f.doctor}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{f.patient}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{f.drugsChecked}</TableCell>
                    <TableCell>
                      <Badge className={f.aiResult === "Avoid" ? "bg-avoid/10 text-avoid" : f.aiResult === "Caution" ? "bg-secondary/20 text-secondary-foreground" : "bg-safe/10 text-safe"}>{f.aiResult}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{f.assessment}</TableCell>
                    <TableCell>{statusBadge(f.status)}</TableCell>
                    <TableCell>
                      {f.status === "Pending" && (
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => markReviewed(f.id)}>Mark Reviewed</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Expanded notes */}
          <div className="space-y-3">
            {filtered.map(f => (
              <div key={f.id} className="bg-card rounded-lg border border-border p-4">
                <p className="text-sm font-medium mb-1">{f.doctor} on {f.patient}</p>
                <p className="text-sm text-muted-foreground italic">"{f.note}"</p>
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminFeedback;
