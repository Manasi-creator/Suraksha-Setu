import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, UserCircle, Phone, Mail } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";

interface PatientItem {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
  status: "Active" | "Inactive";
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  profileCompletion: number;
  dateJoined: string;
}

const DoctorPatients = () => {
  const { user, fetchWithAuth } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Add Patient Form State
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await fetchWithAuth("/api/patients");
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !gender) {
      toast.error("Please fill in name, email and gender");
      return;
    }

    setSubmitting(true);
    try {
      // Patients are registered via auth endpoint
      const res = await fetch("/http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: "patient123", // default password
          role: "patient",
          gender,
          phone,
          age: age ? Number(age) : undefined,
          height: height ? Number(height) : undefined,
          weight: weight ? Number(weight) : undefined,
          assignedDoctor: user?.name || "Dr. Priya Sharma"
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Patient ${name} added! Default password: patient123`);
        setSheetOpen(false);
        // Clear inputs
        setName("");
        setGender("");
        setPhone("");
        setEmail("");
        setAge("");
        setHeight("");
        setWeight("");
        // Reload list
        fetchPatients();
      } else {
        toast.error(data.message || "Failed to register patient");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating patient profile");
    } finally {
      setSubmitting(false);
    }
  };

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
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button className="gradient-gold text-secondary-foreground font-semibold gap-2"><Plus size={16} /> Add New Patient</Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader><SheetTitle>Add New Patient</SheetTitle></SheetHeader>
                <form onSubmit={handleAddPatient} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><UserCircle size={14} /> Full Name</Label>
                    <Input placeholder="Patient name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Transgender">Transgender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone size={14} /> Phone Number</Label>
                    <Input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail size={14} /> Email</Label>
                    <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Ht (cm)</Label>
                      <Input type="number" placeholder="Height" value={height} onChange={e => setHeight(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Wt (kg)</Label>
                      <Input type="number" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">Default login password will be set to: <strong>patient123</strong>. Patient can change this later.</p>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Adding Patient..." : "Add Patient"}
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." className="pl-9" />
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading patients list...</div>
          ) : (
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
                    <span>Joined: {new Date(p.dateJoined).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">No patients found.</div>
              )}
            </div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorPatients;
