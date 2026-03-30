import { useState } from "react";
import { Database, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { modernMedicines, ayurvedicMedicines } from "@/data/mockData";

const AdminMedicines = () => {
  const [search, setSearch] = useState("");

  const filteredModern = modernMedicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const filteredAyurvedic = ayurvedicMedicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

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

          <Tabs defaultValue="modern">
            <TabsList>
              <TabsTrigger value="modern">Modern Medicines ({modernMedicines.length})</TabsTrigger>
              <TabsTrigger value="ayurvedic">Ayurvedic Formulations ({ayurvedicMedicines.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="modern">
              <div className="bg-card rounded-xl border border-border shadow-card overflow-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Active Compounds</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredModern.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.compounds}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{m.category}</TableCell>
                        <TableCell>
                          <Badge className={m.status === "Verified" ? "bg-safe/10 text-safe border-safe/30" : "bg-secondary/20 text-secondary-foreground border-secondary/30"}>{m.status}</Badge>
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
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Active Compounds</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredAyurvedic.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.compounds}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{m.category}</TableCell>
                        <TableCell>
                          <Badge className={m.status === "Verified" ? "bg-safe/10 text-safe border-safe/30" : "bg-secondary/20 text-secondary-foreground border-secondary/30"}>{m.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminMedicines;
