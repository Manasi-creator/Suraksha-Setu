import { useState } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4">
    <h2 className="font-heading font-semibold text-lg">{title}</h2>
    {children}
  </div>
);

const Toggle = ({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm">{label}</span>
      <Switch checked={on} onCheckedChange={v => { setOn(v); toast.success(`${label}: ${v ? "Enabled" : "Disabled"}`); }} />
    </div>
  );
};

const DoctorSettings = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const save = (s: string) => toast.success(`${s} saved successfully`);

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <BackButton to="/doctor/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Settings size={24} className="text-primary" /> Settings</h1>
          </div>

          <Section title="Account Preferences">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Language</Label>
                <Select defaultValue="English"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="English">English</SelectItem><SelectItem value="Hindi">Hindi</SelectItem><SelectItem value="Marathi">Marathi</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1"><Label>Date Format</Label>
                <Select defaultValue="DD/MM/YYYY"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem></SelectContent></Select>
              </div>
            </div>
            <Toggle label="Receive email notifications for new patient alerts" defaultChecked />
            <Toggle label="Receive SMS notifications for high-risk interaction results" />
            <Toggle label="Show confidence score on AI results" defaultChecked />
            <Toggle label="Auto-load patient medications in AI chat" defaultChecked />
            <Button size="sm" onClick={() => save("Account preferences")}>Save</Button>
          </Section>

          <Section title="AI Chat Preferences">
            <Toggle label="Enable voice input in AI chat by default" defaultChecked />
            <Toggle label="Save all AI chat responses to patient history automatically" />
            <Toggle label="Show quick-prompt suggestion chips in AI chat" defaultChecked />
            <div className="space-y-1"><Label>Default AI Response Language</Label>
              <Select defaultValue="English"><SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="English">English</SelectItem><SelectItem value="Hindi">Hindi</SelectItem></SelectContent></Select>
            </div>
            <Button size="sm" onClick={() => save("AI chat preferences")}>Save</Button>
          </Section>

          <Section title="Report Preferences">
            <Toggle label="Auto-generate PDF after every interaction check" />
            <Toggle label="Include molecular compound details in reports" defaultChecked />
            <Toggle label="Include evidence sources in reports" defaultChecked />
            <div className="space-y-1"><Label>Default Report Format</Label>
              <Select defaultValue="Detailed"><SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Detailed">Detailed</SelectItem><SelectItem value="Summary">Summary</SelectItem></SelectContent></Select>
            </div>
            <Button size="sm" onClick={() => save("Report preferences")}>Save</Button>
          </Section>

          <Section title="Security">
            <div className="space-y-3">
              {["Current Password", "New Password", "Confirm New Password"].map(label => (
                <div key={label} className="space-y-1">
                  <Label>{label}</Label>
                  <div className="relative">
                    <Input type={showPwd ? "text" : "password"} placeholder={label} className="pr-10" />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPwd ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  </div>
                </div>
              ))}
              <Button size="sm" onClick={() => save("Password")}>Change Password</Button>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <Label className="text-xs text-muted-foreground">Active Sessions</Label>
              <p className="text-sm mt-1">Currently logged in from Chrome on Windows — Pune, Maharashtra — Today 10:32 AM.</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => setLogoutOpen(true)}>Log out of all devices</Button>
          </Section>
        </div>
        <ConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="Log out of all devices?" description="This will sign you out of all active sessions. You will need to log in again." onConfirm={() => { toast.success("Logged out of all devices"); setLogoutOpen(false); }} />
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorSettings;
