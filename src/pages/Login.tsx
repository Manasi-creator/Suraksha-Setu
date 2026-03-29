import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Stethoscope, HeartHandshake, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLogo from "@/components/AppLogo";
import FloatingLeaves from "@/components/FloatingLeaves";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const roleConfig: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: "Admin", icon: ShieldCheck, color: "from-primary to-primary/80" },
  doctor: { label: "Doctor", icon: Stethoscope, color: "from-primary to-primary/80" },
  patient: { label: "Patient", icon: HeartHandshake, color: "from-primary to-primary/80" },
};

const Login = () => {
  const { role = "patient" } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const config = roleConfig[role] || roleConfig.patient;
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Login successful!", { description: `Welcome to ${config.label} Dashboard` });
      navigate(`/${role}/home`);
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left illustration panel */}
        <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center overflow-hidden">
          <FloatingLeaves />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center p-12"
          >
            <div className="w-32 h-32 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
              <Icon className="text-primary-foreground" size={64} />
            </div>
            <h2 className="text-4xl font-heading font-bold text-primary-foreground mb-3">
              {config.label} Portal
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-sm">
              Access your personalized dashboard for herb-drug interaction analysis
            </p>
          </motion.div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center p-6 botanical-bg">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <AppLogo size="sm" />
            </div>

            <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <Icon className="text-primary-foreground" size={20} />
                </div>
                <h2 className="text-2xl font-heading font-semibold text-foreground">{config.label} Login</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Mail size={14} /> Email Address</Label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm"><Lock size={14} /> Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : "Login"}
                </Button>
              </form>

              {role !== "admin" && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <Link to={`/signup/${role}`} className="text-primary font-medium hover:underline">Sign up</Link>
                </p>
              )}
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

export default Login;
