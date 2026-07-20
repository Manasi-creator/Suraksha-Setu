import { useState, useEffect, useRef } from "react";
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

const prakritiNotes: Record<string, Record<string, string>> = {
  safe: {
    Vata: "Your Vata constitution does not increase the risk here.",
    Pitta: "Your Pitta constitution does not increase the risk here.",
    Kapha: "Your Kapha constitution does not increase the risk here.",
  },
  caution: {
    Vata: "Because you are Vata type, your nervous system may amplify side effects. Monitor carefully.",
    Pitta: "Because you are Pitta type, your liver processes medicines faster — watch for reduced drug efficacy.",
    Kapha: "Because you are Kapha type, your digestion is slower, which can increase absorption and accumulation.",
  },
  avoid: {
    Vata: "This combination is risky for your Vata body type and can cause a dangerous reaction.",
    Pitta: "This combination is risky for your Pitta body type and can cause a dangerous reaction.",
    Kapha: "This combination is risky for your Kapha body type and can cause a dangerous reaction.",
  },
};

const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

const PatientChat = () => {
  const [prakriti, setPrakriti] = useState<PrakritiResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState("en");
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("prakritiResult");
      if (stored) setPrakriti(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const prakritiName = prakriti?.type || "your";
    setMessages([
      {
        id: 1,
        from: "ai",
        text: `Hello Arjun! I'm your AI health assistant${prakriti ? ` — I can see you have a ${prakritiName} constitution` : ""}. I can help you understand potential interactions between your Ayurvedic and modern medicines. What would you like to know?`,
        severity: "safe",
      },
    ]);
  }, [prakriti]);

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

  // --- Voice Input (Web Speech API) ---
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
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
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

    // auto-stop after 5s silence
    setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, 8000);
  };

  // --- Voice Output (SpeechSynthesis) ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang];
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // --- Send message ---
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      const severity: "safe" | "caution" | "avoid" = lower.includes("avoid") || lower.includes("madhunashini")
        ? "avoid"
        : lower.includes("karela") || lower.includes("caution")
          ? "caution"
          : "safe";

      const pType = prakriti?.type || "your";
      let responseText: string;

      if (severity === "safe") {
        responseText = `Good news! For your ${pType} body type, this combination appears safe to take together. ${prakriti ? prakritiNotes.safe[pType] : ""} Continue as your doctor advised and watch for any unusual symptoms.`;
      } else if (severity === "caution") {
        responseText = `⚠️ Be careful! Karela juice can affect how Metformin works in your body. ${prakriti ? prakritiNotes.caution[pType] : "Combined use may increase the risk of hypoglycemia."} Monitor your blood sugar more often and tell your doctor.`;
      } else {
        responseText = `🚫 Do NOT take these together. ${prakriti ? prakritiNotes.avoid[pType] : "This combination has a high risk of adverse interaction."} Please speak to your doctor immediately before taking either medicine.`;
      }

      const aiMsg: Message = { id: Date.now() + 1, from: "ai", text: responseText, severity };
      setMessages((prev) => [...prev, aiMsg]);
      // Speaker button is now shown instead of auto-speaking
    }, 1500);
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

          {/* Chat messages */}
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
                <div className={`max-w-[70%] rounded-2xl p-4 ${
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
                  {msg.from === "ai" && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="ghost" className="text-xs gap-1 h-7 px-2" onClick={() => speak(msg.text)}>
                        <Volume2 size={12} /> Listen
                      </Button>
                      {msg.severity === "avoid" && (
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => toast.success("Alert saved!")}>
                          Save as Alert
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
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

          {/* Input */}
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
