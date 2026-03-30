import { UserCircle, Building2, MapPin, Phone, Mail, Lock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const LockedField = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-sm"><Icon size={14} /> {label}</Label>
    <div className="relative">
      <Input value={value} readOnly className="bg-muted/50 pr-10" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>Contact admin to update this field</TooltipContent>
      </Tooltip>
    </div>
  </div>
);

const DoctorProfile = () => (
  <DashboardLayout role="doctor">
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/doctor/home" />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><UserCircle size={24} className="text-primary" /> My Profile</h1>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-2xl font-bold text-primary-foreground">PM</div>
            <div>
              <h2 className="text-xl font-heading font-semibold">Dr. Priya Mehta</h2>
              <p className="text-sm text-muted-foreground">Ayurvedic General Physician</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><UserCircle size={14} /> Full Name</Label>
              <Input defaultValue="Dr. Priya Mehta" />
            </div>
            <LockedField label="Gender" value="Female" icon={UserCircle} />
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" defaultValue="38" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><Building2 size={14} /> Clinic Name</Label>
              <Input defaultValue="Svastha Ayurveda Clinic" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-sm"><MapPin size={14} /> Clinic Address</Label>
              <Input defaultValue="123, MG Road, Pune, Maharashtra" />
            </div>
            <LockedField label="Phone" value="+91 98765 43210" icon={Phone} />
            <LockedField label="Email" value="priya.mehta@clinic.in" icon={Mail} />
          </div>

          <Button className="mt-6" onClick={() => toast.success("Profile saved successfully!")}>Save Changes</Button>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default DoctorProfile;
