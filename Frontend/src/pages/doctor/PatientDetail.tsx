import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UserCircle, Pill, MessageCircle, Clock, Bell, FileText, Plus, Trash2, Send, Mic, Flag, Lock, Download, Search, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePatientReport } from "@/lib/pdfGenerator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const timingOptions = ["Pre-breakfast", "Post-breakfast", "Pre-lunch", "Post-lunch", "Pre-dinner", "Post-dinner"];
const frequencyOptions = ["Once daily", "Twice daily", "Thrice daily", "As needed", "Twice weekly"];

const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) return { label: "Underweight", color: "text-secondary-foreground" };
  if (bmi < 25) return { label: "Normal", color: "text-safe" };
  if (bmi < 30) return { label: "Overweight", color: "text-secondary-foreground" };
  return { label: "Obese", color: "text-avoid" };
};

const severityColor = (s: string) => {
  if (s === "Safe" || s === "Info") return "bg-safe/10 text-safe border-safe/30";
  if (s === "Caution") return "bg-secondary/20 text-secondary-foreground border-secondary/30";
  return "bg-avoid/10 text-avoid border-avoid/30";
};

const severityStrip = (s: string) => {
  if (s === "High Risk") return "border-l-4 border-l-[hsl(var(--avoid))]";
  if (s === "Caution") return "border-l-4 border-l-[hsl(var(--caution))]";
  return "border-l-4 border-l-[hsl(var(--safe))]";
};

interface PatientItem {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
  status: "Active" | "Inactive";
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  profileCompletion: number;
  dateJoined: string;
}

interface MedicationItem {
  _id: string;
  type: "modern" | "ayurvedic";
  medicine: string;
  dosage: string;
  frequency: string;
  timing: string[];
  notes?: string;
}

interface AlertItem {
  _id: string;
  severity: "High Risk" | "Caution" | "Info";
  message: string;
  sentBy: string;
  status: "Read" | "Unread";
  date: string;
}

interface MedicineItem {
  _id: string;
  name: string;
  compounds: string;
  category: string;
  type: "modern" | "ayurvedic";
}

const PatientDetail = () => {
  const { patientId } = useParams();
  const { user, fetchWithAuth } = useAuth();

  // Dynamic Page States
  const [patient, setPatient] = useState<PatientItem | null>(null);
  const [meds, setMeds] = useState<{ modern: MedicationItem[]; ayurvedic: MedicationItem[] }>({ modern: [], ayurvedic: [] });
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [medicinesList, setMedicinesList] = useState<MedicineItem[]>([]);

  const [loading, setLoading] = useState(true);

  // Modal Dialog states
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [medDialogOpen, setMedDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("interaction");

  // New Prescription Form State
  const [medType, setMedType] = useState<"modern" | "ayurvedic">("modern");
  const [selectedMedName, setSelectedMedName] = useState("");
  const [customMedName, setCustomMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medFrequency, setMedFrequency] = useState("Once daily");
  const [medTimings, setMedTimings] = useState<string[]>([]);
  const [medNotes, setMedNotes] = useState("");

  // New Alert State
  const [alertSeverity, setAlertSeverity] = useState("Caution");
  const [alertMessage, setAlertMessage] = useState("");

  // Chat engine state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Load everything
  const loadPatientData = async () => {
    if (!patientId) return;
    try {
      // 1. Get profile
      const pRes = await fetchWithAuth(`/api/patients/${patientId}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setPatient(pData);
      }

      // 2. Get medications
      const mRes = await fetchWithAuth(`/api/medications/patient/${patientId}`);
      if (mRes.ok) {
        const mData = await mRes.json();
        setMeds(mData);
      }

      // 3. Get alerts
      const aRes = await fetchWithAuth(`/api/alerts/patient/${patientId}`);
      if (aRes.ok) {
        const aData = await aRes.json();
        setAlerts(aData);
      }

      // 4. Get Global Medicines registry
      const medsRes = await fetchWithAuth(`/api/medicines`);
      if (medsRes.ok) {
        const medsData = await medsRes.json();
        setMedicinesList(medsData);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  // Set initial chat messages when patient profile loads
  useEffect(() => {
    if (patient) {
      setChatMessages([
        { id: 1, from: "ai", text: `I am ready. I have loaded ${patient.name}'s medical profile. You can ask about drug-herb interactions, dosage reviews, or clinical safety metrics.`, severity: "safe" }
      ]);
    }
  }, [patient]);

  if (loading) return <DashboardLayout role="doctor"><div className="p-8 text-center text-muted-foreground">Loading patient clinical details...</div></DashboardLayout>;
  if (!patient) return <DashboardLayout role="doctor"><div className="p-8 text-center text-muted-foreground">Patient profile not found</div></DashboardLayout>;

  const bmi = patient.height && patient.weight ? +(patient.weight / ((patient.height / 100) ** 2)).toFixed(1) : null;
  const bmiCat = bmi ? getBmiCategory(bmi) : null;
  const maskedEmail = patient.email || "Not filled yet";

  const handleTimingChange = (time: string, checked: boolean) => {
    if (checked) {
      setMedTimings(prev => [...prev, time]);
    } else {
      setMedTimings(prev => prev.filter(t => t !== time));
    }
  };

  // Prescribe medicine API handler
  const handleAddMedicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMedName = selectedMedName === "custom" ? customMedName : selectedMedName;

    if (!finalMedName || !medDosage) {
      toast.error("Please specify medicine name and dosage");
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/medications/patient/${patient.id}`, {
        method: "POST",
        body: JSON.stringify({
          type: medType,
          medicine: finalMedName,
          dosage: medDosage,
          frequency: medFrequency,
          timing: medTimings,
          notes: medNotes
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Prescribed ${finalMedName} successfully`);
        setMedDialogOpen(false);
        // Reset states
        setSelectedMedName("");
        setCustomMedName("");
        setMedDosage("");
        setMedTimings([]);
        setMedNotes("");
        // Reload
        loadPatientData();
      } else {
        toast.error(data.message || "Failed to prescribe medication");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  // Remove medication API handler
  const handleRemoveMedication = async (medId: string) => {
    try {
      const res = await fetchWithAuth(`/api/medications/${medId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Medication prescription discontinued");
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error discontinuing medication");
    }
  };

  // Send Alert API handler
  const handleSendAlert = async () => {
    if (!alertMessage.trim()) {
      toast.error("Please input an alert message");
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/alerts/patient/${patient.id}`, {
        method: "POST",
        body: JSON.stringify({
          severity: alertSeverity,
          message: alertMessage,
          sentBy: user?.name || "Doctor"
        })
      });

      if (res.ok) {
        toast.success(`Alert notification dispatched to ${patient.name}`);
        setAlertDialogOpen(false);
        setAlertMessage("");
        loadPatientData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send alert notification");
    }
  };

  // AI Chat handler
  const handleChatSubmit = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    try {
      const lowerText = text.toLowerCase();
      const isProfileCheck = lowerText.includes("check") || lowerText.includes("interaction");
      const foundMod = modernKeywords.find(k => lowerText.includes(k));
      const foundAyur = ayurvedicKeywords.find(k => lowerText.includes(k));

      if (isProfileCheck && patient?.id) {
        const res = await fetchWithAuth(`/api/ai/analyze`, {
          method: "POST",
          body: JSON.stringify({
            modernMedicine: medicinesList.find((m: any) => m.type === "modern")?.medicine || "metformin",
            ayurvedicMedicine: medicinesList.find((m: any) => m.type === "ayurvedic")?.medicine || "karela",
            context: `Review ${patient.name}'s medicines for safety.`
          })
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "AI analysis failed");
        }

        const analysis = await res.json();
        const responseText = [
          analysis.summary,
          `Confidence: ${analysis.confidence}%`,
          `Risk level: ${analysis.riskLevel}`,
          `Why it matters:\n• ${analysis.reasons.slice(0, 2).join("\n• ")}`,
          `What to do:\n• ${analysis.recommendations.slice(0, 2).join("\n• ")}`
        ].join("\n\n");

        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          from: "ai",
          text: responseText,
          severity: analysis.verdict === "Unsafe" ? "avoid" : analysis.verdict === "Use with Caution" ? "caution" : "safe"
        }]);
      } else if (foundMod && foundAyur) {
        const res = await fetchWithAuth(`/api/ai/analyze`, {
          method: "POST",
          body: JSON.stringify({
            modernMedicine: foundMod,
            ayurvedicMedicine: foundAyur,
            context: text
          })
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "AI analysis failed");
        }

        const analysis = await res.json();
        const responseText = [
          analysis.summary,
          `Confidence: ${analysis.confidence}%`,
          `Risk level: ${analysis.riskLevel}`,
          `Why it matters:\n• ${analysis.reasons.slice(0, 2).join("\n• ")}`,
          `What to do:\n• ${analysis.recommendations.slice(0, 2).join("\n• ")}`
        ].join("\n\n");

        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          from: "ai",
          text: responseText,
          severity: analysis.verdict === "Unsafe" ? "avoid" : analysis.verdict === "Use with Caution" ? "caution" : "safe"
        }]);
      } else {
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            id: Date.now() + 1,
            from: "ai",
            text: "I can check specific combinations. Please specify both a modern drug and an Ayurvedic formulation in your prompt.",
            severity: "safe"
          }]);
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error checking interactions");
    }
  };

  const modernKeywords = ["metformin", "glipizide", "glibenclamide", "insulin", "sitagliptin", "empagliflozin", "vildagliptin", "pioglitazone"];
  const ayurvedicKeywords = ["karela", "methi", "jamun", "gurmar", "neem", "vijaysar", "madhunashini", "chandraprabha", "triphala", "vasanta"];

  // Filter medicines by type for form selection
  const filteredMedsOptions = medicinesList.filter(m => m.type === medType);

  return (
    <DashboardLayout role="doctor">
      <PageTransition>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/doctor/patients" className="flex items-center gap-1 hover:text-foreground transition-colors"><ArrowLeft size={14} /> My Patients</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{patient.name}</span>
          </div>

          {/* Patient Header */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {patient.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-heading font-bold">{patient.name}</h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient.age && <Badge variant="outline" className="text-xs">{patient.age}y • {patient.gender}</Badge>}
                  {bmi && <Badge className={`text-xs ${severityColor(bmiCat!.label === "Normal" ? "Safe" : "Caution")}`}>BMI {bmi} — {bmiCat!.label}</Badge>}
                  <Badge variant="outline" className="text-xs">{patient.assignedDoctor}</Badge>
                </div>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block">{patient.email}</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="profile" className="gap-1"><UserCircle size={14} /> Profile</TabsTrigger>
              <TabsTrigger value="medications" className="gap-1"><Pill size={14} /> Medications</TabsTrigger>
              <TabsTrigger value="chat" className="gap-1"><MessageCircle size={14} /> AI Chat</TabsTrigger>
              <TabsTrigger value="alerts" className="gap-1"><Bell size={14} /> Alerts & Reports</TabsTrigger>
            </TabsList>

            {/* Tab 1: Profile */}
            <TabsContent value="profile">
              <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", value: patient.name },
                    { label: "Gender", value: patient.gender || "Not specified" },
                    { label: "Age", value: patient.age ? `${patient.age} years` : "Not specified" },
                    { label: "Height", value: patient.height ? `${patient.height} cm` : "Not specified" },
                    { label: "Weight", value: patient.weight ? `${patient.weight} kg` : "Not specified" },
                    { label: "BMI", value: bmi ? `${bmi} — ${bmiCat!.label}` : "Not specified", highlight: bmiCat },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{f.label}</Label>
                      <p className={`text-sm font-medium ${f.value === "Not specified" ? "italic text-muted-foreground" : ""} ${f.highlight ? bmiCat!.color : ""}`}>{f.value}</p>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">Email <Lock size={10} /></Label>
                    <p className="text-sm font-medium">{maskedEmail}</p>
                  </div>
                </div>
                {patient.profileCompletion && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Profile Completion</Label>
                    <Progress value={patient.profileCompletion} className="h-2" />
                    <p className="text-xs text-muted-foreground">{patient.profileCompletion}% complete</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Basic info registered on {new Date(patient.dateJoined).toLocaleDateString("en-IN")}</p>
              </div>
            </TabsContent>

            {/* Tab 2: Medications */}
            <TabsContent value="medications">
              <div className="space-y-6">
                {[
                  { title: "Modern Medicines", items: meds.modern, type: "modern" as const },
                  { title: "Ayurvedic Formulations", items: meds.ayurvedic, type: "ayurvedic" as const }
                ].map(section => (
                  <div key={section.title} className="bg-card rounded-xl border border-border shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold flex items-center gap-2"><Pill size={16} className="text-primary" /> {section.title}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => { setMedType(section.type); setMedDialogOpen(true); }}
                      >
                        <Plus size={14} /> Prescribe
                      </Button>
                    </div>
                    {section.items.length > 0 ? (
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader><TableRow>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Timing</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead></TableHead>
                          </TableRow></TableHeader>
                          <TableBody>
                            {section.items.map((med: MedicationItem) => (
                              <TableRow key={med._id}>
                                <TableCell className="font-medium">{med.medicine}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.frequency}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {med.timing?.map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{med.notes || "—"}</TableCell>
                                <TableCell>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-avoid h-8 w-8 hover:bg-avoid/10"
                                    onClick={() => handleRemoveMedication(med._id)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No medications added yet.</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 3: AI Chat */}
            <TabsContent value="chat">
              <div className="bg-card rounded-xl border border-border shadow-card flex flex-col" style={{ height: "600px" }}>
                <div className="bg-primary/5 border-b border-border px-4 py-3 rounded-t-xl">
                  <p className="text-sm text-primary">AI is pre-loaded with {patient.name}'s current medications. Ask about any interaction, dosage concern, or safe alternative.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.from === "ai" && (
                        <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1"><MessageCircle size={14} className="text-primary" /></div>
                      )}
                      <div className={`rounded-2xl p-4 max-w-md whitespace-pre-line ${msg.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : `bg-muted/50 rounded-bl-md border border-border ${msg.severity ? `severity-${msg.severity}` : ""}`
                        }`}>
                        {msg.severity && msg.from === "ai" && (
                          <Badge className={`mb-2 ${severityColor(msg.severity)}`}>{msg.severity.toUpperCase()}</Badge>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        {msg.from === "ai" && (msg.severity === "avoid" || msg.severity === "caution") && (
                          <div className="flex gap-2 pt-2 mt-2 border-t border-border">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs gap-1"
                              onClick={() => handleSendAlert()}
                            >
                              <Bell size={12} /> Save to Patient Alerts
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border p-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleChatSubmit(chatInput)}
                      placeholder={`Ask about ${patient.name}'s medicines...`}
                      className="flex-1"
                    />
                    <Button size="icon" className={`shrink-0 ${isListening ? "bg-avoid animate-pulse" : ""}`} variant={isListening ? "destructive" : "default"} onClick={() => setIsListening(!isListening)}><Mic size={16} /></Button>
                    <Button size="icon" className="shrink-0" onClick={() => handleChatSubmit(chatInput)}><Send size={16} /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Check all current medications for interactions", `What should ${patient.name.split(" ")[0]} avoid eating?`].map(q => (
                      <button key={q} onClick={() => setChatInput(q)} className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Alerts & Reports */}
            <TabsContent value="alerts">
              <div className="space-y-6">
                {/* Alerts */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold flex items-center gap-2"><Bell size={16} className="text-primary" /> Alerts</h3>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setAlertDialogOpen(true)}><Plus size={14} /> Add Alert</Button>
                  </div>
                  {alerts.length > 0 ? (
                    <div className="space-y-3">
                      {alerts.map(a => (
                        <div key={a._id} className={`${severityStrip(a.severity)} rounded-lg p-4 bg-muted/30`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={severityColor(a.severity === "High Risk" ? "Avoid" : a.severity)}>{a.severity.toUpperCase()}</Badge>
                                {a.status === "Unread" && <span className="w-2 h-2 rounded-full bg-avoid animate-pulse" />}
                              </div>
                              <p className="text-sm">{a.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">Sent by: {a.sentBy} • {new Date(a.date).toLocaleDateString("en-IN")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">No alerts for this patient.</p>
                  )}
                </div>

                {/* Reports */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold flex items-center gap-2"><FileText size={16} className="text-primary" /> Reports</h3>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setReportDialogOpen(true)}><Plus size={14} /> Generate Report</Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border border-border rounded-lg p-4">
                      <div>
                        <p className="text-sm font-medium">Interaction Check Report — Metformin + Karela</p>
                        <div className="flex gap-2 mt-1"><span className="text-xs text-muted-foreground">Generated Today</span><Badge className="text-xs bg-secondary/20 text-secondary-foreground">Caution</Badge></div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                        generatePatientReport(patient, meds, "Interaction Check Report");
                        toast.success("PDF Downloaded successfully");
                      }}><Download size={12} /> PDF</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Prescribe Medication Dialog */}
        <Dialog open={medDialogOpen} onOpenChange={setMedDialogOpen}>
          <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
            <DialogHeader><DialogTitle>Prescribe {medType === "modern" ? "Modern Medicine" : "Ayurvedic Formulation"}</DialogTitle></DialogHeader>
            <form onSubmit={handleAddMedicationSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Medicine Name</Label>
                <Select value={selectedMedName} onValueChange={setSelectedMedName} required>
                  <SelectTrigger><SelectValue placeholder="Select medicine..." /></SelectTrigger>
                  <SelectContent>
                    {filteredMedsOptions.map(m => (
                      <SelectItem key={m._id} value={m.name}>{m.name}</SelectItem>
                    ))}
                    <SelectItem value="custom">+ Write Custom Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedMedName === "custom" && (
                <div className="space-y-1">
                  <Label>Custom Medicine Name</Label>
                  <Input
                    placeholder="Enter medicine name"
                    value={customMedName}
                    onChange={e => setCustomMedName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label>Dosage</Label>
                <Input placeholder="e.g. 500mg, 1 tablet, 10ml" value={medDosage} onChange={e => setMedDosage(e.target.value)} required />
              </div>

              <div className="space-y-1">
                <Label>Frequency</Label>
                <Select value={medFrequency} onValueChange={setMedFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Timing Options</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {timingOptions.map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <Checkbox
                        id={`t-${t}`}
                        checked={medTimings.includes(t)}
                        onCheckedChange={checked => handleTimingChange(t, !!checked)}
                      />
                      <label htmlFor={`t-${t}`} className="text-xs cursor-pointer">{t}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Special Instructions</Label>
                <Textarea placeholder="Notes..." value={medNotes} onChange={e => setMedNotes(e.target.value)} />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setMedDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Prescription</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Alert Dialog */}
        <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Alert for {patient.name}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Severity</Label>
                <Select value={alertSeverity} onValueChange={setAlertSeverity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High Risk">High Risk</SelectItem>
                    <SelectItem value="Caution">Caution</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Message</Label>
                <Textarea value={alertMessage} onChange={e => setAlertMessage(e.target.value)} placeholder="Alert message details..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendAlert}>Send Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Generate Report Dialog */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Generate Diagnostic Report</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="interaction">Interaction Summary</SelectItem><SelectItem value="full">Full Medication Review</SelectItem></SelectContent></Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                generatePatientReport(patient, meds, reportType === "interaction" ? "Interaction Summary" : "Full Medication Review");
                toast.success("Interaction PDF report compiled and downloaded!");
                setReportDialogOpen(false);
              }}>Generate PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientDetail;
