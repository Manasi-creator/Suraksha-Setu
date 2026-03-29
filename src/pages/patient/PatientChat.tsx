import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Mic, Leaf, Shield, AlertTriangle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

const quickPrompts = [
  "Check my current medicines",
  "Is Karela juice safe for me?",
  "What should I avoid with Metformin?",
];

const initialMessages: Message[] = [
  { id: 1, from: "ai", text: "Hello Arjun! I'm your AI health assistant. I can help you understand potential interactions between your Ayurvedic and modern medicines. What would you like to know?", severity: "safe" },
];

const PatientChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const severity = text.toLowerCase().includes("karela") ? "caution" : text.toLowerCase().includes("avoid") ? "avoid" : "safe";
      const responses: Record<string, string> = {
        safe: "Based on your current medication profile, this combination appears safe. No significant interactions were found. Continue as prescribed and monitor for any unusual symptoms.",
        caution: "⚠️ Karela (bitter gourd) juice can lower blood sugar levels significantly. Combined with Metformin, this may increase the risk of hypoglycemia. Use with caution and monitor your blood sugar more frequently.",
        avoid: "🚫 This combination has a high risk of adverse interaction. Glimepiride combined with certain herbal supplements can cause dangerous drops in blood sugar. Please consult your doctor before making any changes.",
      };
      const aiMsg: Message = { id: Date.now() + 1, from: "ai", text: responses[severity], severity };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
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
                  {msg.severity === "avoid" && msg.from === "ai" && (
                    <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => toast.success("Alert saved!")}>
                      Save as Alert
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
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

// Need to import React for createElement
import React from "react";

export default PatientChat;
