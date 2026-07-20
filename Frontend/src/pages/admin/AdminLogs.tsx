import { useState, useEffect } from "react";
import { ScrollText, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";

interface AuditLogItem {
  _id: string;
  action: string;
  performedBy: string;
  target: string;
  details?: string;
  timestamp: string;
}

const AdminLogs = () => {
  const { fetchWithAuth } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetchWithAuth("/api/admin/audit");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [fetchWithAuth]);

  const filteredLogs = logs.filter(
    l => l.action.toLowerCase().includes(search.toLowerCase()) || 
         l.performedBy.toLowerCase().includes(search.toLowerCase()) || 
         l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/admin/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><ScrollText size={24} className="text-primary" /> Audit Logs</h1>
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="pl-9" />
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading logs...</div>
            ) : filteredLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log._id}>
                      <TableCell className="whitespace-nowrap">{new Date(log.timestamp).toLocaleString("en-IN")}</TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.performedBy}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="text-muted-foreground">{log.details || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">No logs found matching your search.</div>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminLogs;
