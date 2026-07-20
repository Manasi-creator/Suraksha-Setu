import { useEffect, useRef, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Mic, Leaf, Shield, AlertTriangle, XCircle, Volume2, VolumeX, Globe, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PrakritiResult {
  type: "Vata" | "Pitta" | "Kapha";
  confidence: number;
  diabetesRisk: "Low" | "Medium" | "High";
}

interface Message {
  id: number;
  from: "user" | "ai";
  text: string;
  severity?: "safe" | "caution" | "avoid";
}

interface AiAnalysisResponse {
  summary: string;
  confidence: number;
  riskLevel: string;
  verdict: string;
  reasons: string[];
  recommendations: string[];
}

const severityConfig = {
  safe: { label: "Safe", icon: Shield, color: "bg-safe/10 text-safe border-safe/30" },
  caution: { label: "Caution", icon: AlertTriangle, color: "bg-caution/10 text-caution border-caution/30" },
  avoid: { label: "Avoid", icon: XCircle, color: "bg-avoid/10 text-avoid border-avoid/30" },
};

const prakritiBannerColors: Record<string, string> = {
  Vata: "bg-blue-50 border-blue-200 text-blue-800",
  Pitta: "bg-orange-50 border-orange-200 text-orange-800",
  Kapha: "bg-primary/5 border-primary/20 text-primary",
};

const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };
const modernKeywords = ["metformin", "glipizide", "glibenclamide", "insulin", "sitagliptin", "empagliflozin", "vildagliptin", "pioglitazone"];
const ayurvedicKeywords = ["karela", "methi", "jamun", "gurmar", "neem", "vijaysar", "madhunashini", "chandraprabha", "triphala", "vasanta"];

const formatAnalysisMessage = (result: AiAnalysisResponse) => {
  const severity = result.verdict === "Unsafe" ? "avoid" : result.verdict === "Use with Caution" ? "caution" : "safe";
  const reasons = result.reasons.length ? result.reasons.slice(0, 2).join("\n• ") : "No extra reasons were provided.";
  const recommendations = result.recommendations.length ? result.recommendations.slice(0, 2).join("\n• ") : "Please ask a doctor if you are unsure.";
  return [
    result.summary,
    `Confidence: ${result.confidence}%`,
    `Risk level: ${result.riskLevel}`,
    `Final verdict: ${result.verdict}`,
    `Reasons:\n• ${reasons}`,
    `Recommendations:\n• ${recommendations}`,
  ].join("\n\n");
};

const extractMedicineName = (text: string, keywords: string[]) => {
  const lower = text.toLowerCase();
  const hit = keywords.find((keyword) => lower.includes(keyword));
  return hit ? hit.charAt(0).toUpperCase() + hit.slice(1) : "";
};

const PatientChat = () => {
  const { user, fetchWithAuth } = useAuth();
  const [prakriti, setPrakriti] = useState<PrakritiResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState("en");
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("prakritiResult");
      if (stored) setPrakriti(JSON.parse(stored));
    } catch {
      // ignore malformed local storage data
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          from: "ai",
          text: `Hello ${user?.name || "Arjun"}! I'm your AI health assistant. I can help you understand potential interactions between your Ayurvedic and modern medicines. What would you like to know?`,
          severity: "safe",
        },
      ]);
    }
  }, [messages.length, user?.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = prakriti
    ? [
        `Is Karela juice safe for my ${prakriti.type} Prakriti?`,
        "Can I take Metformin with Methi seeds?",
        `What should a ${prakriti.type} person avoid?`,
      ]
    : [
        "Check my current medicines",
        "Is Karela juice safe for me?",
        "What should I avoid with Metformin?",
      ];

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang];
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[lang];
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Could not recognise speech. Try again.");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    toast.info("Listening...");

    setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, 8000);
  };

  const handleSaveAlert = async (messageText: string, severityLabel: "safe" | "caution" | "avoid") => {
    if (!user) return;
    try {
      const res = await fetchWithAuth(`/api/alerts/patient/${user.id}`, {
        method: "POST",
        body: JSON.stringify({
          severity: severityLabel === "avoid" ? "High Risk" : severityLabel === "caution" ? "Caution" : "Info",
          message: messageText,
          sentBy: "AI System",
        }),
      });

      if (res.ok) {
        toast.success("Alert saved to your profile!");
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body.message || "Failed to save alert");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save alert");
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      let modernMedicine = extractMedicineName(text, modernKeywords);
      let ayurvedicMedicine = extractMedicineName(text, ayurvedicKeywords);

      if (!modernMedicine || !ayurvedicMedicine) {
        const medsRes = await fetchWithAuth(`/api/medications/patient/${user.id}`);
        if (medsRes.ok) {
          const medsData = await medsRes.json();
          const modernMeds = medsData?.modern || [];
          const ayurvedicMeds = medsData?.ayurvedic || [];
          if (!modernMedicine && modernMeds[0]?.medicine) {
            modernMedicine = modernMeds[0].medicine;
          }
          if (!ayurvedicMedicine && ayurvedicMeds[0]?.medicine) {
            ayurvedicMedicine = ayurvedicMeds[0].medicine;
          }
        }
      }

      if (!modernMedicine || !ayurvedicMedicine) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: "ai",
            text: "I need a modern medicine and an Ayurvedic medicine to analyze the interaction. You can mention them directly or check your current medications first.",
            severity: "safe",
          },
        ]);
        return;
      }

      const res = await fetchWithAuth("/api/ai/analyze", {
        method: "POST",
        body: JSON.stringify({
          modernMedicine,
          ayurvedicMedicine,
          context: text,
        }),
      });

      const analysis = await res.json();
      if (!res.ok) {
        throw new Error(analysis.message || "AI analysis failed");
      }

      const aiText = formatAnalysisMessage(analysis as AiAnalysisResponse);
      const severity = analysis.verdict === "Unsafe" ? "avoid" : analysis.verdict === "Use with Caution" ? "caution" : "safe";
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "ai", text: aiText, severity }]);
      speak(analysis.summary || "Here is your interaction summary.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error communicating with the AI checker backend");
    }
  };

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <MessageCircle size={24} className="text-primary" /> AI Health Chat
            </h1>
            <div className="ml-auto flex items-center gap-2">
              {speaking && (
                <Button size="sm" variant="outline" onClick={stopSpeaking} className="text-destructive border-destructive gap-1">
                  <VolumeX size={14} /> Stop Speaking
                </Button>
              )}
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <Globe size={14} className="mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prakriti context banner */}
          {prakriti ? (
            <div className={`rounded-lg p-3 flex items-center gap-2 text-sm border mb-3 ${prakritiBannerColors[prakriti.type]}`}>
              <Shield size={16} className="shrink-0" />
              <span className="font-medium">Your Prakriti: {prakriti.type}</span>
              <span className="mx-1">|</span>
              <span>Diabetes Risk: {prakriti.diabetesRisk}</span>
            </div>
          ) : (
            <Link to="/patient/prakriti" className="rounded-lg p-3 flex items-center gap-2 text-sm border border-primary/20 bg-primary/5 text-primary mb-3 hover:bg-primary/10 transition-colors">
              <LinkIcon size={16} className="shrink-0" />
              Complete your Prakriti Assessment first →
            </Link>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Leaf size={16} className="text-primary shrink-0" />
            This AI checks potential interactions between your Ayurvedic and modern medicines. Always consult your doctor before making changes.
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "ai" && (
                  <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Leaf size={14} className="text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[70%] rounded-2xl p-4 whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border shadow-sm rounded-bl-md"
                }`}>
                  {msg.severity && msg.from === "ai" && (
                    <Badge className={`mb-2 ${severityConfig[msg.severity].color}`}>
                      {React.createElement(severityConfig[msg.severity].icon, { size: 12, className: "mr-1" })}
                      {severityConfig[msg.severity].label}
                    </Badge>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {(msg.severity === "avoid" || msg.severity === "caution") && msg.from === "ai" && (
                    <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => handleSaveAlert(msg.text, msg.severity)}>
                      Save as Alert
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="px-3 py-1.5 rounded-full text-xs border border-border bg-card hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about your medicines..."
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`relative ${listening ? "text-destructive border-destructive" : ""}`}
            >
              <Mic size={18} />
              {listening && <span className="absolute inset-0 rounded-md border-2 border-destructive animate-pulse" />}
            </Button>
            <Button onClick={() => sendMessage(input)} size="icon">
              <Send size={18} />
            </Button>
          </div>
          {listening && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs text-destructive font-medium">Listening...</span>
            </motion.div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientChat;
