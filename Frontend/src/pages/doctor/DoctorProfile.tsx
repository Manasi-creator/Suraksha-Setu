import { useEffect, useState } from "react";
import { UserCircle, Building2, Phone, Mail, Lock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const LockedField = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-sm"><Icon size={14} /> {label}</Label>
    <div className="relative">
      <Input value={value} readOnly className="bg-muted/50 pr-10" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>Only admins can update this field</TooltipContent>
      </Tooltip>
    </div>
  </div>
);

const DoctorProfile = () => {
  const { user, fetchWithAuth } = useAuth();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const res = await fetchWithAuth("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const profile = data.user || {};
          setName(profile.name || user.name || "");
          setGender(profile.gender || "");
          setAge(profile.age ? String(profile.age) : "");
          setClinicName(profile.clinicName || "");
          setPhone(profile.phone || "");
          setEmail(profile.email || user.email || "");
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
      }
    };

    loadProfile();
  }, [user, fetchWithAuth]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetchWithAuth("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify({
          name,
          age: age ? Number(age) : undefined,
          gender: gender || undefined,
          clinicName: clinicName || undefined,
          phone: phone || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile saved successfully!");
        setName(data.user?.name || name);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || user?.name || "Doctor").split(" ").slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/doctor/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><UserCircle size={24} className="text-primary" /> My Profile</h1>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-2xl font-bold text-primary-foreground">{initials || "DR"}</div>
              <div>
                <h2 className="text-xl font-heading font-semibold">{name || user?.name || "Doctor"}</h2>
                <p className="text-sm text-muted-foreground">Ayurvedic physician profile</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><UserCircle size={14} /> Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><UserCircle size={14} /> Gender</Label>
                <Input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><Building2 size={14} /> Clinic Name</Label>
                <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Clinic name" />
              </div>
              <LockedField label="Phone" value={phone || "Not specified"} icon={Phone} />
              <LockedField label="Email" value={email || "Not specified"} icon={Mail} />
            </div>

            <Button className="mt-6" onClick={handleSaveChanges} disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorProfile;
