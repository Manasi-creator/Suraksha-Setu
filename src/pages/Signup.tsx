import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  User, Users, Calendar, Building2, MapPin, Phone, PhoneCall, Mail, Lock,
  Stethoscope, HeartHandshake, ArrowLeft, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLogo from "@/components/AppLogo";
import FloatingLeaves from "@/components/FloatingLeaves";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const Signup = () => {
  const { role = "patient" } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isDoctor = role === "doctor";
  const Icon = isDoctor ? Stethoscope : HeartHandshake;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Account created!", { description: "Awaiting verification." });
    }, 1500);
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center botanical-bg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center p-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="text-primary" size={48} />
            </motion.div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Account Created!</h2>
            <p className="text-muted-foreground mb-8">Awaiting verification. You'll be notified once approved.</p>
            <Button onClick={() => navigate(`/login/${role}`)}>Go to Login</Button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center overflow-hidden">
          <FloatingLeaves />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10 text-center p-12">
            <div className="w-32 h-32 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
              <Icon className="text-primary-foreground" size={64} />
            </div>
            <h2 className="text-4xl font-heading font-bold text-primary-foreground mb-3">
              Join as {isDoctor ? "Doctor" : "Patient"}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-sm">Create your account to start using AI-powered herb-drug interaction analysis</p>
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 botanical-bg overflow-y-auto">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg my-8">
            <div className="mb-6"><AppLogo size="sm" /></div>

            <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <Icon className="text-primary-foreground" size={20} />
                </div>
                <h2 className="text-2xl font-heading font-semibold">{isDoctor ? "Doctor" : "Patient"} Sign Up</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><User size={14} /> Full Name</Label>
                  <Input placeholder="Enter your full name" required />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Users size={14} /> Gender</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="transgender">Transgender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isDoctor && (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm"><Calendar size={14} /> Age</Label>
                      <Input type="number" placeholder="Age" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm"><Building2 size={14} /> Clinic Name</Label>
                      <Input placeholder="Clinic name" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm"><MapPin size={14} /> Clinic Address</Label>
                      <Input placeholder="Full address" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm"><PhoneCall size={14} /> Alt Phone</Label>
                      <Input type="tel" placeholder="Alternative phone" />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Phone size={14} /> Phone Number</Label>
                  <Input type="tel" placeholder="Phone number" required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Mail size={14} /> Email</Label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Lock size={14} /> Password</Label>
                  <Input type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Lock size={14} /> Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" required />
                </div>

                {!isDoctor && (
                  <p className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
                    📋 Your doctor will complete your medical profile after signup.
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link to={`/login/${role}`} className="text-primary font-medium hover:underline">Login</Link>
              </p>
            </div>

            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-6 justify-center">
              <ArrowLeft size={14} /> Back to role selection
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Signup;
