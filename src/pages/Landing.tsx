import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogo from "@/components/AppLogo";
import FloatingLeaves from "@/components/FloatingLeaves";
import PageTransition from "@/components/PageTransition";

const roles = [
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage users, medicines & system settings" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "Consult patients & check interactions" },
  { id: "patient", label: "Patient", icon: HeartHandshake, desc: "View medications & get AI guidance" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen botanical-bg flex flex-col items-center justify-center relative overflow-hidden px-4">
        <FloatingLeaves />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <AppLogo size="lg" />
          </div>
          <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto">
            Bridging Ayurveda and Modern Medicine, Safely.
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px -12px hsl(120 20% 15% / 0.18)" }}
              onClick={() => navigate(`/login/${role.id}`)}
              className="bg-card rounded-xl p-8 shadow-card flex flex-col items-center gap-4 cursor-pointer border border-border transition-colors hover:border-primary/30"
            >
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center">
                <role.icon className="text-primary-foreground" size={30} />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground">{role.label}</h3>
              <p className="text-sm text-muted-foreground text-center">{role.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Landing;
