import { Settings, Globe, Bell as BellIcon, Lock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PatientSettings = () => (
  <DashboardLayout role="patient">
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/home" />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Settings size={24} className="text-primary" /> Settings</h1>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-4">
          <h3 className="font-heading font-semibold flex items-center gap-2"><Globe size={16} /> Language</h3>
          <Select defaultValue="en">
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="mr">Marathi</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => toast.success("Language updated!")}>Save</Button>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-4">
          <h3 className="font-heading font-semibold flex items-center gap-2"><BellIcon size={16} /> Notifications</h3>
          <div className="flex items-center justify-between">
            <Label>Email alerts</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>In-app alerts</Label>
            <Switch defaultChecked />
          </div>
          <Button size="sm" onClick={() => toast.success("Notification preferences saved!")}>Save</Button>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 space-y-4">
          <h3 className="font-heading font-semibold flex items-center gap-2"><Lock size={16} /> Change Password</h3>
          <div className="space-y-3">
            <Input type="password" placeholder="Current password" />
            <Input type="password" placeholder="New password" />
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button size="sm" onClick={() => toast.success("Password changed successfully!")}>Update Password</Button>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default PatientSettings;
