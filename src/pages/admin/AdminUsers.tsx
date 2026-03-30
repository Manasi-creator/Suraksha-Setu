import { useState } from "react";
import { Users, Search, Eye } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { mockDoctors, mockPatients, type Doctor, type Patient } from "@/data/mockData";

const AdminUsers = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{ type: "doctor" | "patient"; id: string; newStatus: "Active" | "Inactive" } | null>(null);

  const handleToggle = (type: "doctor" | "patient", id: string, current: string) => {
    const newStatus = current === "Active" ? "Inactive" : "Active";
    setPendingToggle({ type, id, newStatus });
    setConfirmOpen(true);
  };

  const confirmToggle = () => {
    if (!pendingToggle) return;
    if (pendingToggle.type === "doctor") {
      setDoctors(prev => prev.map(d => d.id === pendingToggle.id ? { ...d, status: pendingToggle.newStatus } : d));
    } else {
      setPatients(prev => prev.map(p => p.id === pendingToggle.id ? { ...p, status: pendingToggle.newStatus } : p));
    }
    toast.success(`User ${pendingToggle.newStatus === "Active" ? "activated" : "deactivated"} successfully`);
    setConfirmOpen(false);
    setPendingToggle(null);
  };

  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()));
  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role="admin">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/admin/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Users size={24} className="text-primary" /> User Management</h1>
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>

          <Tabs defaultValue="doctors">
            <TabsList>
              <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
              <TabsTrigger value="patients">Patients ({patients.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="doctors">
              <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Clinic</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{d.email}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{d.clinic}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{d.phone}</TableCell>
                        <TableCell>
                          <Badge className={d.status === "Active" ? "bg-safe/10 text-safe border-safe/30" : "bg-muted text-muted-foreground"}>{d.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{d.dateJoined}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="text-xs gap-1"><Eye size={12} /> View</Button>
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => handleToggle("doctor", d.id, d.status)}>
                              {d.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="patients">
              <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Assigned Doctor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{p.assignedDoctor}</TableCell>
                        <TableCell>
                          <Badge className={p.status === "Active" ? "bg-safe/10 text-safe border-safe/30" : "bg-muted text-muted-foreground"}>{p.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{p.dateJoined}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="text-xs gap-1"><Eye size={12} /> View</Button>
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => handleToggle("patient", p.id, p.status)}>
                              {p.status === "Active" ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Change user status?" description={`Are you sure you want to ${pendingToggle?.newStatus === "Active" ? "activate" : "deactivate"} this user? This will ${pendingToggle?.newStatus === "Inactive" ? "revoke their access" : "restore their access"}.`} onConfirm={confirmToggle} />
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminUsers;
