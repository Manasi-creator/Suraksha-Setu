import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";

// Auth pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Patient pages
import PatientHome from "./pages/patient/PatientHome";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientMedications from "./pages/patient/PatientMedications";
import PatientChat from "./pages/patient/PatientChat";
import PatientAlerts from "./pages/patient/PatientAlerts";
import PatientHistory from "./pages/patient/PatientHistory";
import PatientReports from "./pages/patient/PatientReports";
import PatientSettings from "./pages/patient/PatientSettings";

// Doctor pages
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorChat from "./pages/doctor/DoctorChat";
import { DoctorHistory, DoctorReports, DoctorAlerts, DoctorSettings } from "./pages/doctor/DoctorPlaceholders";

// Admin pages
import AdminHome from "./pages/admin/AdminHome";
import { AdminUsers, AdminMedicines, AdminLogs, AdminAnalytics, AdminFeedback, AdminSettings } from "./pages/admin/AdminPlaceholders";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/signup/:role" element={<Signup />} />

            {/* Patient routes */}
            <Route path="/patient/home" element={<PatientHome />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/medications" element={<PatientMedications />} />
            <Route path="/patient/chat" element={<PatientChat />} />
            <Route path="/patient/alerts" element={<PatientAlerts />} />
            <Route path="/patient/history" element={<PatientHistory />} />
            <Route path="/patient/reports" element={<PatientReports />} />
            <Route path="/patient/settings" element={<PatientSettings />} />

            {/* Doctor routes */}
            <Route path="/doctor/home" element={<DoctorHome />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/chat" element={<DoctorChat />} />
            <Route path="/doctor/history" element={<DoctorHistory />} />
            <Route path="/doctor/reports" element={<DoctorReports />} />
            <Route path="/doctor/alerts" element={<DoctorAlerts />} />
            <Route path="/doctor/settings" element={<DoctorSettings />} />

            {/* Admin routes */}
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/medicines" element={<AdminMedicines />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
