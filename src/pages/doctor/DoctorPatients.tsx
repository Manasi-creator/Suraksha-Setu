import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, UserCircle } from "lucide-react";
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

const patients = [
  { name: "Arjun Sharma", age: 28, gender: "Male", lastVisit: "2024-03-25", meds: 4, risk: false },
  { name: "Meera Patel", age: 55, gender: "Female", lastVisit: "2024-03-24", meds: 6, risk: true },
  { name: "Ravi Kumar", age: 42, gender: "Male", lastVisit: "2024-03-23", meds: 3, risk: false },
  { name: "Sunita Devi", age: 60, gender: "Female", lastVisit: "2024-03-22", meds: 5, risk: true },
  { name: "Amit Joshi", age: 35, gender: "Male", lastVisit: "2024-03-20", meds: 2, risk: false },
  { name: "Kavita Singh", age: 48, gender: "Female", lastVisit: "2024-03-18", meds: 4, risk: false },
];

const DoctorPatients = () => {
  const [search, setSearch] = useState("");
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
                <Button className="gradient-gold text-secondary-foreground font-semibold gap-2">
                  <Plus size={16} /> Add New Patient
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Add New Patient</SheetTitle></SheetHeader>
                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><UserCircle size={14} /> Full Name</Label>
                    <Input placeholder="Patient name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="transgender">Transgender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input type="tel" placeholder="Phone" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Email" />
                  </div>
                  <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
                    The patient will complete their profile after login.
                  </p>
                  <Button className="w-full" onClick={() => toast.success("Patient added. Login credentials sent to email.")}>
                    Add Patient
                  </Button>
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
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl shadow-card border border-border p-5 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.gender} • Age {p.age}</p>
                  </div>
                  {p.risk && <Badge className="ml-auto bg-avoid/10 text-avoid border-avoid/30 text-xs">Risk</Badge>}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last visit: {p.lastVisit}</span>
                  <span>{p.meds} medications</span>
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
