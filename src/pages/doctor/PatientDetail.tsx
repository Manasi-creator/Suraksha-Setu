import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UserCircle, Pill, MessageCircle, Clock, Bell, FileText, Plus, Trash2, Send, Mic, Flag, Lock, Download, Search, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { mockPatients, modernMedicines, ayurvedicMedicines, patientMedications, rajeshHistory, rajeshAlerts, rajeshReports } from "@/data/mockData";

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

const PatientDetail = () => {
  const { patientId } = useParams();
  const patient = mockPatients.find(p => p.id === patientId);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("Caution");
  const [alertMessage, setAlertMessage] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  if (!patient) return <DashboardLayout role="doctor"><div className="p-8 text-center text-muted-foreground">Patient not found</div></DashboardLayout>;

  const bmi = patient.height && patient.weight ? +(patient.weight / ((patient.height / 100) ** 2)).toFixed(1) : null;
  const bmiCat = bmi ? getBmiCategory(bmi) : null;
  const meds = patientMedications[patient.id] || { modern: [], ayurvedic: [] };
  const isRajesh = patient.id === "p1";
  const maskedEmail = patient.email ? patient.email.substring(0, 3) + "***@" + patient.email.split("@")[1] : "Not filled yet";
  const maskedPhone = patient.phone || "Not filled yet";

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
              {maskedPhone !== "Not filled yet" && <span className="text-sm text-muted-foreground hidden sm:block">{maskedPhone}</span>}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="profile" className="gap-1"><UserCircle size={14} /> Profile</TabsTrigger>
              <TabsTrigger value="medications" className="gap-1"><Pill size={14} /> Medications</TabsTrigger>
              <TabsTrigger value="chat" className="gap-1"><MessageCircle size={14} /> AI Chat</TabsTrigger>
              <TabsTrigger value="history" className="gap-1"><Clock size={14} /> History</TabsTrigger>
              <TabsTrigger value="alerts" className="gap-1"><Bell size={14} /> Alerts & Reports</TabsTrigger>
            </TabsList>

            {/* Tab 1: Profile */}
            <TabsContent value="profile">
              <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", value: patient.name },
                    { label: "Gender", value: patient.gender || "Not filled yet" },
                    { label: "Age", value: patient.age ? `${patient.age} years` : "Not filled yet" },
                    { label: "Height", value: patient.height ? `${patient.height} cm` : "Not filled yet" },
                    { label: "Weight", value: patient.weight ? `${patient.weight} kg` : "Not filled yet" },
                    { label: "BMI", value: bmi ? `${bmi} — ${bmiCat!.label}` : "Not filled yet", highlight: bmiCat },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{f.label}</Label>
                      <p className={`text-sm font-medium ${f.value === "Not filled yet" ? "italic text-muted-foreground" : ""} ${f.highlight ? bmiCat!.color : ""}`}>{f.value}</p>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">Phone <Lock size={10} /></Label>
                    <p className="text-sm font-medium">{maskedPhone}</p>
                  </div>
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

                {/* Ayurvedic Profile - Prakriti */}
                <div className="border-t border-border pt-5 space-y-3">
                  <h3 className="font-heading font-semibold flex items-center gap-2 text-sm"><Sparkles size={16} className="text-secondary" /> Ayurvedic Profile</h3>
                  {isRajesh ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/30 border">Prakriti: Kapha</Badge>
                        <Badge className="bg-avoid/10 text-avoid border-avoid/30 border"><ShieldCheck size={12} className="mr-1" /> Diabetes Risk: High</Badge>
                        <Badge variant="outline" className="text-xs">Confidence: 89%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Determined via full-body video analysis on 10 Apr 2025</p>
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Prakriti assessment not yet completed</p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">Basic info added by doctor on {patient.dateJoined}</p>
              </div>
            </TabsContent>

            {/* Tab 2: Medications */}
            <TabsContent value="medications">
              <div className="space-y-6">
                {[{ title: "Modern Medicines", items: meds.modern, options: modernMedicines }, { title: "Ayurvedic Formulations", items: meds.ayurvedic, options: ayurvedicMedicines }].map(section => (
                  <div key={section.title} className="bg-card rounded-xl border border-border shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold flex items-center gap-2"><Pill size={16} className="text-primary" /> {section.title}</h3>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Add row functionality")}><Plus size={14} /> Add</Button>
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
                            {section.items.map((med: any, i: number) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{med.medicine}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.frequency}</TableCell>
                                <TableCell><div className="flex flex-wrap gap-1">{med.timing.map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                                <TableCell className="text-sm text-muted-foreground">{med.notes || "—"}</TableCell>
                                <TableCell><Button size="icon" variant="ghost" className="text-avoid h-8 w-8" onClick={() => toast.success("Medication removed")}><Trash2 size={14} /></Button></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No medications added yet.</p>
                    )}
                    <Button size="sm" className="mt-4" onClick={() => toast.success("Medications saved successfully")}>Save Medications</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 3: AI Chat */}
            <TabsContent value="chat">
              <div className="bg-card rounded-xl border border-border shadow-card flex flex-col" style={{ height: "600px" }}>
                <div className="bg-primary/5 border-b border-border px-4 py-3 rounded-t-xl space-y-2">
                  <p className="text-sm text-primary">AI is pre-loaded with {patient.name}'s current medications. Ask about any interaction, dosage concern, or safe alternative.</p>
                  {isRajesh ? (
                    <p className="text-xs font-medium text-primary/80 flex items-center gap-1"><Sparkles size={12} /> AI is aware of {patient.name}'s Prakriti: <Badge className="bg-primary/10 text-primary border-0 text-xs ml-1">Kapha</Badge> and Diabetes Risk: <Badge className="bg-avoid/10 text-avoid border-0 text-xs ml-1">High</Badge></p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Prakriti data not available for this patient</p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isRajesh && (
                    <>
                      <div className="flex justify-end"><div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 max-w-xs text-sm">Is it safe for Rajesh to continue Karela juice with Metformin 500mg twice daily?</div></div>
                      <div className="flex gap-3">
                         <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center"><MessageCircle size={14} className="text-primary" /></div>
                        <div className="bg-muted/50 rounded-2xl rounded-bl-md p-4 max-w-md space-y-3 severity-caution">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">CAUTION</Badge>
                            <Badge variant="outline" className="text-xs bg-primary/5 text-primary">Assessed for: Kapha type</Badge>
                          </div>
                          <p className="text-sm">Both Metformin and Karela juice lower blood sugar through different mechanisms — Metformin via AMPK pathway, Karela via charantin and polypeptide-P. Combined use may cause additive hypoglycaemic effect, especially if Karela juice is consumed in concentrated form (&gt;150ml). Recommend monitoring fasting blood sugar daily and reducing Karela to 100ml if values drop below 90 mg/dL.</p>
                          <p className="text-sm text-muted-foreground">Additionally, Rajesh's Kapha Prakriti means slower gastrointestinal motility, which may increase absorption of Karela compounds, amplifying the hypoglycaemic effect beyond what is seen in average patients.</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">Confidence: 78%</Badge>
                            <Badge variant="outline" className="text-xs">Based on 9 clinical studies and molecular docking data</Badge>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.success(`Alert saved to ${patient.name}'s alerts`)}><Bell size={12} /> Save to Patient Alerts</Button>
                            <Button size="sm" variant="ghost" className="text-xs gap-1"><Flag size={12} /> Flag AI Result</Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="border-t border-border p-4 space-y-3">
                  <div className="flex gap-2">
                    <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={`Ask about ${patient.name}'s medicines...`} className="flex-1" />
                    <Button size="icon" className={`shrink-0 ${isListening ? "bg-avoid animate-pulse" : ""}`} variant={isListening ? "destructive" : "default"} onClick={() => setIsListening(!isListening)}><Mic size={16} /></Button>
                    <Button size="icon" className="shrink-0"><Send size={16} /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Check all current medications for interactions", "Suggest safe Ayurvedic alternatives", `What should ${patient.name.split(" ")[0]} avoid eating?`].map(q => (
                      <button key={q} onClick={() => setChatInput(q)} className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: History */}
            <TabsContent value="history">
              <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <div className="relative flex-1 max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search history..." className="pl-8" /></div>
                </div>
                {isRajesh ? (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader><TableRow>
                         <TableHead>Date</TableHead><TableHead>Modern Drug</TableHead><TableHead>Ayurvedic</TableHead><TableHead>Prakriti</TableHead><TableHead>Result</TableHead><TableHead className="hidden md:table-cell">Checked By</TableHead><TableHead>Actions</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {rajeshHistory.map((h, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm">{h.date}</TableCell>
                            <TableCell className="text-sm">{h.modernDrug}</TableCell>
                            <TableCell className="text-sm">{h.ayurvedic}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs bg-primary/5 text-primary">Kapha</Badge></TableCell>
                            <TableCell><Badge className={severityColor(h.result)}>{h.result}</Badge></TableCell>
                            <TableCell className="hidden md:table-cell text-sm">{h.checkedBy}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="text-xs">View Report</Button>
                                <Button size="sm" variant="ghost" className="text-xs gap-1"><Download size={10} /> PDF</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No interaction history for this patient yet.</p>
                )}
              </div>
            </TabsContent>

            {/* Tab 5: Alerts & Reports */}
            <TabsContent value="alerts">
              <div className="space-y-6">
                {/* Alerts */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold flex items-center gap-2"><Bell size={16} className="text-primary" /> Alerts</h3>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setAlertDialogOpen(true)}><Plus size={14} /> Add Alert</Button>
                  </div>
                  {isRajesh ? (
                    <div className="space-y-3">
                      {rajeshAlerts.map(a => (
                        <div key={a.id} className={`${severityStrip(a.severity)} rounded-lg p-4 bg-muted/30`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={severityColor(a.severity === "High Risk" ? "Avoid" : a.severity)}>{a.severity.toUpperCase()}</Badge>
                                {a.status === "Unread" && <span className="w-2 h-2 rounded-full bg-avoid animate-pulse" />}
                              </div>
                              <p className="text-sm">{a.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">Sent by: {a.sentBy} • {a.date}</p>
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
                  {isRajesh ? (
                    <div className="space-y-3">
                      {rajeshReports.map(r => (
                        <div key={r.id} className="flex items-center justify-between border border-border rounded-lg p-4">
                          <div>
                            <p className="text-sm font-medium">{r.title}</p>
                            <div className="flex gap-2 mt-1"><span className="text-xs text-muted-foreground">{r.date}</span><Badge className={`text-xs ${severityColor(r.severity)}`}>{r.severity}</Badge></div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1"><Download size={12} /> PDF</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">No reports for this patient.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Alert Dialog */}
        <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Alert for {patient.name}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Severity</Label>
                <Select value={alertSeverity} onValueChange={setAlertSeverity}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="High Risk">High Risk</SelectItem><SelectItem value="Caution">Caution</SelectItem><SelectItem value="Info">Info</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1"><Label>Message</Label><Textarea value={alertMessage} onChange={e => setAlertMessage(e.target.value)} placeholder="Alert message..." /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast.success(`Alert sent to ${patient.name}`); setAlertDialogOpen(false); setAlertMessage(""); }}>Send Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Generate Report Dialog */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Generate Report</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Report Type</Label>
                <Select defaultValue="interaction"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="interaction">Interaction Summary</SelectItem><SelectItem value="full">Full Medication Review</SelectItem></SelectContent></Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast.success("Report generated successfully"); setReportDialogOpen(false); }}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientDetail;
