import { useState, useEffect } from "react";
import { Database, Search, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface MedicineItem {
  _id: string;
  name: string;
  compounds: string;
  category: string;
  type: "modern" | "ayurvedic";
  status: "Verified" | "Needs Review";
}

const AdminMedicines = () => {
  const { user, fetchWithAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const res = await fetchWithAuth("/api/medicines");
      if (res.ok) {
        const data = await res.json();
        setMedicines(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [user]);

  const handleVerify = async (id: string) => {
    try {
      const res = await fetchWithAuth(`/api/medicines/${id}/verify`, {
        method: "PUT"
      });
      if (res.ok) {
        toast.success("Medicine verified successfully");
        setMedicines(prev => prev.map(m => m._id === id ? { ...m, status: "Verified" } : m));
      } else {
        toast.error("Failed to verify medicine");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during verification");
    }
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const filteredModern = filtered.filter(m => m.type === "modern");
  const filteredAyurvedic = filtered.filter(m => m.type === "ayurvedic");

  return (
    <DashboardLayout role="admin">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/admin/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Database size={24} className="text-primary" /> Medicine Database</h1>
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..." className="pl-9" />
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading registry...</div>
          ) : (
            <Tabs defaultValue="modern">
              <TabsList>
                <TabsTrigger value="modern">Modern Medicines ({filteredModern.length})</TabsTrigger>
                <TabsTrigger value="ayurvedic">Ayurvedic Formulations ({filteredAyurvedic.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="modern">
                <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Active Compounds</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModern.map(m => (
                        <TableRow key={m._id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.compounds}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{m.category}</TableCell>
                          <TableCell>
                            <Badge className={m.status === "Verified" ? "bg-safe/10 text-safe border-safe/30" : "bg-secondary/20 text-secondary-foreground border-secondary/30"}>{m.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {m.status === "Needs Review" && (
                              <Button size="sm" variant="ghost" className="text-primary flex items-center gap-1" onClick={() => handleVerify(m._id)}>
                                <CheckCircle size={14} /> Verify
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="ayurvedic">
                <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Active Compounds</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAyurvedic.map(m => (
                        <TableRow key={m._id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.compounds}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{m.category}</TableCell>
                          <TableCell>
                            <Badge className={m.status === "Verified" ? "bg-safe/10 text-safe border-safe/30" : "bg-secondary/20 text-secondary-foreground border-secondary/30"}>{m.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {m.status === "Needs Review" && (
                              <Button size="sm" variant="ghost" className="text-primary flex items-center gap-1" onClick={() => handleVerify(m._id)}>
                                <CheckCircle size={14} /> Verify
                              </Button>
                            )}
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
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminMedicines;
