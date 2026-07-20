import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Mic, Leaf, Shield, AlertTriangle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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

const quickPrompts = [
  "Check my current medicines",
  "Is Karela juice safe for me?",
  "What should I avoid with Metformin?",
];

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
    `Why it matters:\n• ${reasons}`,
    `What to do:\n• ${recommendations}`
  ].join("\n\n");
};

const PatientChat = () => {
  const { user, fetchWithAuth } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "ai", text: `Hello ${user?.name || "Arjun"}! I'm your AI health assistant. I can help you understand potential interactions between your Ayurvedic and modern medicines. What would you like to know?`, severity: "safe" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const handleSaveAlert = async (messageText: string, severityLabel: string) => {
    if (!user) return;
    try {
      const res = await fetchWithAuth(`/api/alerts/patient/${user.id}`, {
        method: "POST",
        body: JSON.stringify({
          severity: severityLabel === "avoid" ? "High Risk" : severityLabel === "caution" ? "Caution" : "Info",
          message: messageText,
          sentBy: "AI System"
        })
      });
      if (res.ok) {
        toast.success("Alert saved to your profile!");
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
      const lowerText = text.toLowerCase();
      const isProfileCheck = lowerText.includes("current medicines") || lowerText.includes("check my medicines");

      if (isProfileCheck) {
        const medsRes = await fetchWithAuth(`/api/medications/patient/${user.id}`);
        if (!medsRes.ok) throw new Error("Unable to read medicines");
        const medsData = await medsRes.json();
        const modernMeds = medsData.filter((m: any) => m.type === "modern").map((m: any) => m.medicine);
        const ayurvedicMeds = medsData.filter((m: any) => m.type === "ayurvedic").map((m: any) => m.medicine);

        if (modernMeds.length > 0 && ayurvedicMeds.length > 0) {
          const res = await fetchWithAuth(`/api/ai/analyze`, {
            method: "POST",
            body: JSON.stringify({
              modernMedicine: modernMeds[0],
              ayurvedicMedicine: ayurvedicMeds[0],
              context: `Patient profile check for ${user.name}`
            })
          });
          if (!res.ok) throw new Error("AI analysis failed");
          const analysis: AiAnalysisResponse = await res.json();
          setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            from: "ai",
            text: formatAnalysisMessage(analysis),
            severity: analysis.verdict === "Unsafe" ? "avoid" : analysis.verdict === "Use with Caution" ? "caution" : "safe"
          }]);
        } else {
          setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            from: "ai",
            text: "I could not find enough medicine information to run an AI check. Please add your medicines first.",
            severity: "safe"
          }]);
        }
      } else {
        const foundModern = modernKeywords.find((k) => lowerText.includes(k));
        const foundAyur = ayurvedicKeywords.find((k) => lowerText.includes(k));

        if (foundModern && foundAyur) {
          const res = await fetchWithAuth(`/api/ai/analyze`, {
            method: "POST",
            body: JSON.stringify({
              modernMedicine: foundModern,
              ayurvedicMedicine: foundAyur,
              context: text
            })
          });

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.message || "AI analysis failed");
          }

          const analysis: AiAnalysisResponse = await res.json();
          setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            from: "ai",
            text: formatAnalysisMessage(analysis),
            severity: analysis.verdict === "Unsafe" ? "avoid" : analysis.verdict === "Use with Caution" ? "caution" : "safe"
          }]);
        } else {
          setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            from: "ai",
            text: "I can check specific combinations for you. Please mention both a modern drug and an Ayurvedic herb in your query.",
            severity: "safe"
          }]);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error communicating with the AI checker backend");
    }
  };

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex items-center gap-3 mb-4">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <MessageCircle size={24} className="text-primary" /> AI Health Chat
            </h1>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2 text-sm text-muted-foreground mb-4">
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3 text-xs" 
                      onClick={() => handleSaveAlert(msg.text, msg.severity || "caution")}
                    >
                      Save as Alert
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
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
              onClick={() => { setListening(!listening); if (!listening) toast.info("Listening..."); }}
              className={`relative ${listening ? "text-destructive border-destructive" : ""}`}
            >
              <Mic size={18} />
              {listening && <span className="absolute inset-0 rounded-md border-2 border-destructive animate-pulse-ring" />}
            </Button>
            <Button onClick={() => sendMessage(input)} size="icon">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PatientChat;
