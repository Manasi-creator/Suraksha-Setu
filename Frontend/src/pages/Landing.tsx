import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, HeartHandshake, Leaf, FlaskConical, Mic, FileText, Bell, Users, Activity, Sparkles, Zap, UserPlus, Pill, Cpu, GitCompare, AlertTriangle, LogIn, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogo from "@/components/AppLogo";
import FloatingLeaves from "@/components/FloatingLeaves";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

const roles = [
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage users, medicines & system settings" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "Consult patients & check interactions" },
  { id: "patient", label: "Patient", icon: HeartHandshake, desc: "View medications & get AI guidance" },
];

const features = [
  { icon: ShieldCheck, color: "bg-primary/10 text-primary", title: "AI-Powered Safety Checks", desc: "Instantly detect dangerous interactions between Ayurvedic herbs and modern diabetes medicines." },
  { icon: Leaf, color: "bg-primary/10 text-primary", title: "Ayurvedic Intelligence", desc: "Our database covers 200+ Ayurvedic formulations including herbs, churnas, vatis, and home remedies." },
  { icon: FlaskConical, color: "bg-secondary/20 text-secondary-foreground", title: "Molecular Analysis", desc: "AI analyses interactions at the molecular level — identifying which compounds cause which effects." },
  { icon: Mic, color: "bg-primary/10 text-primary", title: "Voice-Enabled Chat", desc: "Ask about your medicines using your voice. Our AI understands natural language queries in English and Hindi." },
  { icon: FileText, color: "bg-secondary/20 text-secondary-foreground", title: "Instant Reports", desc: "Generate a professional PDF interaction report for any patient in one click." },
  { icon: Bell, color: "bg-primary/10 text-primary", title: "Smart Alerts", desc: "Doctors receive automatic alerts when a patient's new prescription conflicts with their current Ayurvedic intake." },
  { icon: Users, color: "bg-secondary/20 text-secondary-foreground", title: "Multi-Role Access", desc: "Separate portals for Admins, Doctors, and Patients — each with a personalised, role-appropriate experience." },
  { icon: Activity, color: "bg-primary/10 text-primary", title: "Diabetes-First Focus", desc: "Purpose-built for diabetes management, with plans to expand to hypertension, thyroid, and arthritis." },
];

const steps = [
  { icon: UserPlus, title: "Doctor adds patient", desc: "Doctor registers the patient and assigns their current modern medicines and Ayurvedic formulations." },
  { icon: Pill, title: "Medicines recorded", desc: "Drugs, dosage, timing, and Ayurvedic herbs are entered into the patient's profile with pre/post meal timings." },
  { icon: Cpu, title: "AI analyses compounds", desc: "Our AI extracts the active molecular compounds from each medicine and herb and maps potential interactions." },
  { icon: GitCompare, title: "Interactions detected", desc: "The system checks for dangerous combinations, additive effects, absorption conflicts, and enzyme interference." },
  { icon: AlertTriangle, title: "Severity assigned", desc: "Each interaction is labeled Safe, Caution, or Avoid — with a confidence score and the clinical reason." },
  { icon: FileText, title: "Report generated", desc: "A professional PDF summary is created instantly, ready for the patient's file or hospital records." },
  { icon: Bell, title: "Doctor alerted", desc: "High-risk results trigger an immediate notification to the doctor and an alert in the patient's portal." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-card/85 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppLogo size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <Button size="sm" onClick={() => navigate("/login/doctor")} className="gap-1.5">
                <LogIn size={14} /> Login
              </Button>
            </div>
          </div>
        </header>

        {/* Hero + Role Selection */}
        <div className="botanical-bg flex flex-col items-center justify-center relative overflow-hidden px-4 py-16 md:py-24">
          <FloatingLeaves />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 text-center mb-10">
            <div className="flex justify-center mb-4">
              <AppLogo size="lg" />
            </div>
            <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto">Bridging Ayurveda and Modern Medicine, Safely.</p>
          </motion.div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
            {roles.map((role, i) => (
              <motion.button key={role.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }} whileHover={{ y: -6, boxShadow: "0 16px 40px -12px hsl(120 20% 15% / 0.18)" }} onClick={() => navigate(`/login/${role.id}`)} className="bg-card rounded-xl p-8 shadow-card flex flex-col items-center gap-4 cursor-pointer border border-border transition-colors hover:border-primary/30">
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center">
                  <role.icon className="text-primary-foreground" size={30} />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground">{role.label}</h3>
                <p className="text-sm text-muted-foreground text-center">{role.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground flex items-center justify-center gap-2">
                <Sparkles size={28} className="text-secondary" /> Everything you need, in one place
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-card-hover transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon size={26} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/30 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground flex items-center justify-center gap-2">
                <Zap size={28} className="text-secondary" /> From prescription to safety — in seconds
              </h2>
            </motion.div>
            <div className="overflow-x-auto pb-4">
              <div className="flex items-start gap-0 min-w-[1100px] px-4">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex items-start">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center w-[150px] shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary mb-3">{i + 1}</div>
                      <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center mb-3">
                        <step.icon size={22} className="text-primary" />
                      </div>
                      <h4 className="font-heading font-semibold text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </motion.div>
                    {i < steps.length - 1 && (
                      <div className="flex items-center mt-6 mx-1">
                        <svg width="40" height="20" className="overflow-visible">
                          <line x1="0" y1="10" x2="40" y2="10" stroke="hsl(120, 75%, 23%)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
                          <polygon points="36,5 42,10 36,15" fill="hsl(120, 75%, 23%)" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="text-primary-foreground py-12 px-4" style={{ backgroundColor: "#1A3A1A" }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Leaf className="text-white" size={20} />
                </div>
                <span className="text-xl font-heading font-bold text-white">Suraksha Setu</span>
              </div>
              <p className="text-sm text-white/70 mb-2">Bridging Ayurveda and Modern Medicine, Safely.</p>
              <p className="text-xs text-white/50">A government-supported initiative for safer integrative healthcare in India.</p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="/login/doctor" className="hover:text-white transition-colors">Login</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><Mail size={14} /> ayurinteract@gov.in</li>
                <li className="flex items-center gap-2"><Phone size={14} /> +91-XXXX-XXXXXX</li>
                <li className="flex items-center gap-2"><MapPin size={14} /> Pune, Maharashtra, India</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40">
            © 2025 AyurInteract. Developed under the Government of India — Ayush Ministry Initiative. All rights reserved.
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Landing;
