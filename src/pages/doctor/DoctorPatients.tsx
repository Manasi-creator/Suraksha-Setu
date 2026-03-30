import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { mockPatients } from "@/data/mockData";

const DoctorPatients = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const patients = mockPatients.filter(p => p.assignedDoctor === "Dr. Priya Sharma" || true); // show all for demo
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <BackButton to="/doctor/home" />
              <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Users size={24} className="text-primary" /> My Patients</h1>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="gradient-gold text-secondary-foreground font-semibold gap-2"><Plus size={16} /> Add New Patient</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Add New Patient</SheetTitle></SheetHeader>
                <div className="space-y-4 mt-6">
                  <div className="space-y-2"><Label className="flex items-center gap-2"><UserCircle size={14} /> Full Name</Label><Input placeholder="Patient name" /></div>
                  <div className="space-y-2"><Label>Gender</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="transgender">Transgender</SelectItem></SelectContent></Select>
                  </div>
                  <div className="space-y-2"><Label>Phone Number</Label><Input type="tel" placeholder="Phone" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
                  <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">The patient will complete their profile after login.</p>
                  <Button className="w-full" onClick={() => toast.success("Patient added. Login credentials sent to email.")}>Add Patient</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." className="pl-9" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/doctor/patients/${p.id}`)}
                className="bg-card rounded-xl shadow-card border border-border p-5 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.gender || "—"} {p.age ? `• Age ${p.age}` : ""}</p>
                  </div>
                  {p.status === "Inactive" && <Badge className="ml-auto bg-muted text-muted-foreground text-xs">Inactive</Badge>}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.assignedDoctor}</span>
                  <span>{p.dateJoined}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorPatients;
