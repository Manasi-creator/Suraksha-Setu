import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { UserCircle, Calendar, Ruler, Weight, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

const PatientProfile = () => {
  const [age, setAge] = useState("28");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("72");

  const bmi = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return null;
  }, [height, weight]);

  const bmiCategory = useMemo(() => {
    if (!bmi) return null;
    const v = parseFloat(bmi);
    if (v < 18.5) return { label: "Underweight", color: "text-caution", bg: "bg-caution", pct: 20 };
    if (v < 25) return { label: "Normal", color: "text-safe", bg: "bg-safe", pct: 45 };
    if (v < 30) return { label: "Overweight", color: "text-caution", bg: "bg-caution", pct: 70 };
    return { label: "Obese", color: "text-avoid", bg: "bg-avoid", pct: 90 };
  }, [bmi]);

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><UserCircle size={24} className="text-primary" /> My Profile</h1>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-4">
            <h3 className="font-heading font-semibold text-lg">Basic Information</h3>
            <p className="text-xs text-muted-foreground">Managed by your doctor</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LockedField label="Patient ID" value="PT-2024-0042" icon={UserCircle} />
              <LockedField label="Full Name" value="Arjun Sharma" icon={UserCircle} />
              <LockedField label="Gender" value="Male" icon={UserCircle} />
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-4">
            <h3 className="font-heading font-semibold text-lg">My Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><Calendar size={14} /> Age</Label>
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><Ruler size={14} /> Height (cm)</Label>
                <Input type="number" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><Weight size={14} /> Weight (kg)</Label>
                <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>

            {bmi && bmiCategory && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-accent/30 rounded-xl p-5 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Body Mass Index</span>
                  <span className={`text-2xl font-heading font-bold ${bmiCategory.color}`}>{bmi}</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${bmiCategory.bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${bmiCategory.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className={`text-sm mt-2 font-medium ${bmiCategory.color}`}>
                  {bmiCategory.label} — {parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 ? "Your BMI is in the healthy range." : "Consider consulting your doctor."}
                </p>
              </motion.div>
            )}

            <Button onClick={() => toast.success("Profile saved successfully!")} className="mt-4">Save Changes</Button>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientProfile;
