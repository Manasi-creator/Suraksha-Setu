import { useEffect, useState } from "react";
import { MessageCircle, Leaf, Send } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PatientOption {
  id: string;
  name: string;
}

const DoctorChat = () => {
  const { fetchWithAuth } = useAuth();
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetchWithAuth("/api/patients");
        if (!res.ok) return;
        const data = await res.json();
        setPatients(data.map((item: any) => ({ id: item.id || item._id, name: item.name })) || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadPatients();
  }, [fetchWithAuth]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const payload: Record<string, string> = {
        modernMedicine: "metformin",
        ayurvedicMedicine: "karela",
        context: prompt
      };
      if (selectedPatient) {
        payload.context = `${prompt} Patient: ${selectedPatient}`;
      }
      const res = await fetchWithAuth("/api/ai/analyze", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "AI analysis failed");
      }
      const data = await res.json();
      setAnswer([data.summary, `Confidence: ${data.confidence}%`, `Verdict: ${data.verdict}`].join("\n\n"));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "The AI service is unavailable right now.");
      setAnswer("The AI service is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger><SelectValue placeholder="Select a patient to load their medications" /></SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                  ))}
                  <SelectItem value="general">General query (no patient)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask the AI about a medication concern" className="flex-1" />
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Checking..." : <><Send size={16} className="mr-2" /> Ask AI</>}
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground whitespace-pre-line min-h-[120px]">
              {answer || "Select a patient above to start an AI consultation with their medication context loaded."}
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default DoctorChat;
