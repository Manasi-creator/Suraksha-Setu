import { useState, useEffect } from "react";
import { MessageSquareWarning } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackEntry {
  _id: string;
  doctor: string;
  patient: string;
  drugsChecked: string;
  aiResult: string;
  assessment: "Correct" | "Partially Correct" | "Incorrect";
  note: string;
  status: "Pending" | "Reviewed" | "Escalated";
  date: string;
}

const AdminFeedback = () => {
  const { user, fetchWithAuth } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const res = await fetchWithAuth("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [user]);

  const updateStatus = async (id: string, newStatus: "Reviewed" | "Escalated") => {
    try {
      const res = await fetchWithAuth(`/api/feedback/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Feedback marked as ${newStatus.toLowerCase()}`);
        setFeedback(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  const statusBadge = (s: string) => {
    if (s === "Reviewed") return <Badge className="bg-safe/10 text-safe border-safe/30">Reviewed</Badge>;
    if (s === "Escalated") return <Badge className="bg-avoid/10 text-avoid border-avoid/30">Escalated</Badge>;
    return <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">Pending</Badge>;
  };

  const doctors = [...new Set(feedback.map(f => f.doctor))];

  const filtered = feedback.filter(f => {
    if (statusFilter !== "All" && f.status !== statusFilter) return false;
    if (doctorFilter !== "All" && f.doctor !== doctorFilter) return false;
    return true;
  });

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

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading feedback list...</div>
          ) : (
            <>
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
                      <TableRow key={f._id}>
                        <TableCell className="text-sm">{new Date(f.date).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell className="text-sm font-medium">{f.doctor}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{f.patient}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{f.drugsChecked}</TableCell>
                        <TableCell>
                          <Badge className={f.aiResult === "Avoid" ? "bg-avoid/10 text-avoid border-avoid/30" : f.aiResult === "Caution" ? "bg-secondary/20 text-secondary-foreground border-secondary/30" : "bg-safe/10 text-safe border-safe/30"}>{f.aiResult}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{f.assessment}</TableCell>
                        <TableCell>{statusBadge(f.status)}</TableCell>
                        <TableCell>
                          {f.status === "Pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="text-xs text-primary" onClick={() => updateStatus(f._id, "Reviewed")}>Mark Reviewed</Button>
                              <Button size="sm" variant="ghost" className="text-xs text-avoid" onClick={() => updateStatus(f._id, "Escalated")}>Escalate</Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No feedback reports found matching these filters.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Expanded notes */}
              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-lg">Detailed Doctor Comments</h3>
                {filtered.map(f => (
                  <div key={f._id} className="bg-card rounded-lg border border-border p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">{f.doctor} regarding interaction assessment</p>
                      <span className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Prescription: {f.drugsChecked} • AI Result: {f.aiResult} • Assessment: {f.assessment}</p>
                    <p className="text-sm text-foreground italic bg-muted/40 p-3 rounded border border-border">"{f.note}"</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminFeedback;
