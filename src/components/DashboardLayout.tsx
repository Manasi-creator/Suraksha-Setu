import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, UserCircle, Pill, MessageCircle, Bell, Clock, FileText, Settings, LogOut,
  Stethoscope, Users, LayoutDashboard, Database, ScrollText, BarChart2, MessageSquareWarning, Settings2,
  ShieldCheck, HeartHandshake, Menu, Sparkles,
} from "lucide-react";
import AppLogo from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

interface NavItem {
  label: string;
  icon: any;
  path: string;
  badge?: number;
}

const patientNav: NavItem[] = [
  { label: "Home", icon: Home, path: "/patient/home" },
  { label: "Profile", icon: UserCircle, path: "/patient/profile" },
  { label: "Medications", icon: Pill, path: "/patient/medications" },
  { label: "Know Your Prakriti", icon: Sparkles, path: "/patient/prakriti" },
  { label: "AI Chat", icon: MessageCircle, path: "/patient/chat" },
  { label: "Alerts", icon: Bell, path: "/patient/alerts", badge: 3 },
  { label: "History", icon: Clock, path: "/patient/history" },
  { label: "Reports", icon: FileText, path: "/patient/reports" },
  { label: "Settings", icon: Settings, path: "/patient/settings" },
];

const doctorNav: NavItem[] = [
  { label: "Home", icon: LayoutDashboard, path: "/doctor/home" },
  { label: "Profile", icon: UserCircle, path: "/doctor/profile" },
  { label: "Patients", icon: Users, path: "/doctor/patients" },
  { label: "History", icon: Clock, path: "/doctor/history" },
  { label: "Reports", icon: FileText, path: "/doctor/reports" },
  { label: "Alerts", icon: Bell, path: "/doctor/alerts", badge: 5 },
  { label: "Settings", icon: Settings, path: "/doctor/settings" },
];

const adminNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin/home" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Medicines", icon: Database, path: "/admin/medicines" },
  { label: "Audit Logs", icon: ScrollText, path: "/admin/logs" },
  { label: "Analytics", icon: BarChart2, path: "/admin/analytics" },
  { label: "Feedback", icon: MessageSquareWarning, path: "/admin/feedback" },
  { label: "Settings", icon: Settings2, path: "/admin/settings" },
];

const roleIcons: Record<string, any> = {
  patient: HeartHandshake,
  doctor: Stethoscope,
  admin: ShieldCheck,
};

const roleNames: Record<string, string> = {
  patient: "Arjun Sharma",
  doctor: "Dr. Priya Mehta",
  admin: "System Admin",
};

interface DashboardLayoutProps {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role === "patient" ? patientNav : role === "doctor" ? doctorNav : adminNav;
  const RoleIcon = roleIcons[role];

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Horizontal top nav */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center h-16">
          <Link to={`/${role}/home`} className="shrink-0 mr-6">
            <AppLogo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      style={{ bottom: "-9px" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info + logout */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                <RoleIcon className="text-primary-foreground" size={14} />
              </div>
              <span className="text-sm font-medium text-foreground">{roleNames[role]}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut size={16} />
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button className="lg:hidden ml-auto p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1"
          >
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                    active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-destructive w-full">
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
