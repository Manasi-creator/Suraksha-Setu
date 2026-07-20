import { MessageCircle, Leaf } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const DoctorChat = () => (
  <DashboardLayout role="doctor">
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/doctor/home" />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><MessageCircle size={24} className="text-primary" /> AI Consultation</h1>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Leaf size={14} className="text-primary" /> Select Patient</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select a patient to load their medications" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="arjun">Arjun Sharma</SelectItem>
                <SelectItem value="meera">Meera Patel</SelectItem>
                <SelectItem value="ravi">Ravi Kumar</SelectItem>
                <SelectItem value="general">General query (no patient)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p>Select a patient above to start an AI consultation with their medication context loaded.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default DoctorChat;
