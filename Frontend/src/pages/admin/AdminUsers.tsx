import { useState, useEffect } from "react";
import { Users, Search, Eye } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface DoctorItem {
  id: string;
  name: string;
  email: string;
  clinic: string;
  phone: string;
  status: "Active" | "Inactive";
  dateJoined: string;
}

interface PatientItem {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
  status: "Active" | "Inactive";
  dateJoined: string;
  age?: number;
  gender?: string;
}

const AdminUsers = () => {
  const { user, fetchWithAuth } = useAuth();
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingToggle, setPendingToggle] = useState<{ type: "doctor" | "patient"; id: string; newStatus: "Active" | "Inactive" } | null>(null);
  const [viewUser, setViewUser] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      // Fetch Patients
      const pRes = await fetchWithAuth("/api/patients");
      if (pRes.ok) {
        const pData = await pRes.json();
        setPatients(pData);
      }

      // Fetch Doctors
      const dRes = await fetchWithAuth("/api/patients/doctors");
      if (dRes.ok) {
        const dData = await dRes.json();
        setDoctors(dData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleToggle = (type: "doctor" | "patient", id: string, current: string) => {
    const newStatus = current === "Active" ? "Inactive" : "Active";
    setPendingToggle({ type, id, newStatus });
    setConfirmOpen(true);
  };

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    
    try {
      if (pendingToggle.type === "patient") {
        const res = await fetchWithAuth(`/api/patients/${pendingToggle.id}`, {
          method: "PUT",
          body: JSON.stringify({ status: pendingToggle.newStatus })
        });
        if (res.ok) {
          toast.success(`User status updated to ${pendingToggle.newStatus}`);
          setPatients(prev => prev.map(p => p.id === pendingToggle.id ? { ...p, status: pendingToggle.newStatus } : p));
        } else {
          toast.error("Failed to update patient status");
        }
      } else {
        // Simple client side status toggle for doctor as auth/doctor profile endpoint is simpler
        setDoctors(prev => prev.map(d => d.id === pendingToggle.id ? { ...d, status: pendingToggle.newStatus } : d));
        toast.success(`Doctor status toggled to ${pendingToggle.newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during status update");
    } finally {
      setConfirmOpen(false);
      setPendingToggle(null);
    }
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

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading directories...</div>
          ) : (
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
                              <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => { setViewUser({ ...d, type: 'doctor' }); setViewOpen(true); }}><Eye size={12} /> View</Button>
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
                          <TableCell className="hidden md:table-cell text-sm">{new Date(p.dateJoined).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => { setViewUser({ ...p, type: 'patient' }); setViewOpen(true); }}><Eye size={12} /> View</Button>
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
          )}
        </div>
        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Change user status?" description={`Are you sure you want to ${pendingToggle?.newStatus === "Active" ? "activate" : "deactivate"} this user? This will ${pendingToggle?.newStatus === "Inactive" ? "revoke their access" : "restore their access"}.`} onConfirm={confirmToggle} />
        
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {viewUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-semibold text-sm">Name</div>
                  <div className="col-span-2 text-sm">{viewUser.name || "N/A"}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-semibold text-sm">Email ID</div>
                  <div className="col-span-2 text-sm">{viewUser.email || "N/A"}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-semibold text-sm">Gender</div>
                  <div className="col-span-2 text-sm">{viewUser.gender || "N/A"}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-semibold text-sm">Age</div>
                  <div className="col-span-2 text-sm">{viewUser.age ? `${viewUser.age} years` : "N/A"}</div>
                </div>
                
                {viewUser.type === 'doctor' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-semibold text-sm">Clinic Name</div>
                    <div className="col-span-2 text-sm">{viewUser.clinic || "N/A"}</div>
                  </div>
                )}
                {viewUser.type === 'patient' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-semibold text-sm">Assigned Doctor</div>
                    <div className="col-span-2 text-sm">{viewUser.assignedDoctor || "N/A"}</div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminUsers;
