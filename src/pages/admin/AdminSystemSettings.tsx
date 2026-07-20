import { useState } from "react";
import { Settings2, Lock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const Section = ({ title, children, unsaved }: { title: string; children: React.ReactNode; unsaved?: boolean }) => (
  <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4">
    <div className="flex items-center gap-2">
      <h2 className="font-heading font-semibold text-lg">{title}</h2>
      {unsaved && <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 text-xs">Unsaved</Badge>}
    </div>
    {children}
  </div>
);

const ToggleRow = ({ label, defaultChecked = false, disabled = false, badge, locked }: { label: string; defaultChecked?: boolean; disabled?: boolean; badge?: string; locked?: boolean }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}</span>
        {locked && <Tooltip><TooltipTrigger><Lock size={12} className="text-muted-foreground" /></TooltipTrigger><TooltipContent>Core module — contact system administrator to disable</TooltipContent></Tooltip>}
        {badge && <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 text-xs">{badge}</Badge>}
      </div>
      <Switch checked={locked ? true : on} disabled={disabled || locked} onCheckedChange={v => { setOn(v); toast.success(`${label}: ${v ? "Enabled" : "Disabled"}`); }} />
    </div>
  );
};

const AdminSystemSettings = () => {
  const [redThreshold, setRedThreshold] = useState([75]);
  const [amberThreshold, setAmberThreshold] = useState([50]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [hospitalName, setHospitalName] = useState("AyurInteract Government Ayurveda Hospital");

  const save = (section: string) => toast.success(`${section} saved successfully`);

  return (
    <DashboardLayout role="admin">
      <PageTransition>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton to="/admin/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Settings2 size={24} className="text-primary" /> System Settings</h1>
          </div>

          <Section title="Hospital Information">
            <div className="space-y-3">
              <div className="space-y-1"><Label>Hospital / Institution Name</Label><Input value={hospitalName} onChange={e => setHospitalName(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>City</Label>
                  <Select defaultValue="Pune"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pune">Pune</SelectItem><SelectItem value="Mumbai">Mumbai</SelectItem><SelectItem value="Nashik">Nashik</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1"><Label>State</Label>
                  <Select defaultValue="Maharashtra"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Maharashtra">Maharashtra</SelectItem><SelectItem value="Karnataka">Karnataka</SelectItem></SelectContent></Select>
                </div>
              </div>
              <Button size="sm" onClick={() => save("Hospital information")}>Save changes</Button>
            </div>
          </Section>

          <Section title="Active Disease Modules">
            <ToggleRow label="Diabetes" defaultChecked locked />
            <ToggleRow label="Hypertension" disabled badge="Coming soon" />
            <ToggleRow label="Thyroid Disorders" disabled badge="Coming soon" />
            <ToggleRow label="Arthritis" disabled badge="Coming soon" />
            <ToggleRow label="Liver Disorders" disabled badge="Coming soon" />
            <Button size="sm" onClick={() => save("Disease modules")}>Save changes</Button>
          </Section>

          <Section title="AI Alert Thresholds">
            <div className="space-y-4">
              <div>
                <Label>Minimum confidence for RED alert: {redThreshold[0]}%</Label>
                <Slider value={redThreshold} onValueChange={setRedThreshold} min={50} max={95} step={1} className="mt-2" />
              </div>
              <div>
                <Label>Minimum confidence for AMBER alert: {amberThreshold[0]}%</Label>
                <Slider value={amberThreshold} onValueChange={setAmberThreshold} min={30} max={74} step={1} className="mt-2" />
              </div>
              <p className="text-xs text-muted-foreground">Results below the amber threshold will be shown as informational only and will not trigger notifications.</p>
              <Button size="sm" onClick={() => save("Alert thresholds")}>Save changes</Button>
            </div>
          </Section>

          <Section title="Notification Settings">
            <ToggleRow label="Send email alert to doctor on high-risk interaction" defaultChecked />
            <ToggleRow label="Send SMS alert to doctor on high-risk interaction" />
            <ToggleRow label="Send in-app alert to patient on high-risk interaction" defaultChecked />
            <ToggleRow label="Auto-generate PDF report on every interaction check" />
            <ToggleRow label="Require doctor confirmation before sending alert to patient" defaultChecked />
            <Button size="sm" onClick={() => save("Notification settings")}>Save changes</Button>
          </Section>

          <Section title="Language & Localisation">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1"><Label>Default Language</Label>
                <Select defaultValue="English"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="English">English</SelectItem><SelectItem value="Hindi">Hindi</SelectItem><SelectItem value="Marathi">Marathi</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1"><Label>Date Format</Label>
                <Select defaultValue="DD/MM/YYYY"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1">
                <Label className="flex items-center gap-1">Timezone <Lock size={12} className="text-muted-foreground" /></Label>
                <Input value="IST — UTC+5:30" readOnly className="bg-muted/50" />
              </div>
            </div>
            <Button size="sm" onClick={() => save("Language settings")}>Save changes</Button>
          </Section>

          <Section title="Data & Privacy">
            <ToggleRow label="Allow doctors to export patient data as CSV" />
            <ToggleRow label="Enable audit logging for all user actions" defaultChecked />
            <ToggleRow label="Anonymise patient data in analytics charts" defaultChecked />
            <Button size="sm" variant="destructive" className="gap-2 mt-2" onClick={() => setDeleteOpen(true)}>
              <AlertTriangle size={14} /> Clear all audit logs
            </Button>
            <Button size="sm" onClick={() => save("Privacy settings")}>Save changes</Button>
          </Section>
        </div>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear All Audit Logs</DialogTitle>
              <DialogDescription>This will permanently delete all audit logs. This action cannot be undone. Type DELETE to confirm.</DialogDescription>
            </DialogHeader>
            <Input value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder="Type DELETE" />
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" disabled={deleteText !== "DELETE"} onClick={() => { toast.success("All audit logs cleared"); setDeleteOpen(false); setDeleteText(""); }}>Confirm Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AdminSystemSettings;
