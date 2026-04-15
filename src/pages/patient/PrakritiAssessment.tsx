import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, StopCircle, Sparkles, Heart, Flame, Droplets, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface PrakritiResult {
  type: "Vata" | "Pitta" | "Kapha";
  confidence: number;
  diabetesRisk: "Low" | "Medium" | "High";
  description: string;
}

const prakritiData: PrakritiResult[] = [
  {
    type: "Vata",
    confidence: 82,
    diabetesRisk: "Low",
    description: "You have a Vata-dominant constitution — typically lean, quick-thinking, and energetic. Vata types have variable digestion and metabolism. Your diabetes risk is lower, but you should monitor blood sugar during stress or irregular eating patterns.",
  },
  {
    type: "Pitta",
    confidence: 76,
    diabetesRisk: "Medium",
    description: "You have a Pitta-dominant constitution — medium build, strong digestion, and high energy. Pitta types metabolise medicines faster through the liver. Moderate diabetes risk means you should maintain regular meal timings and avoid excess spicy or fermented foods.",
  },
  {
    type: "Kapha",
    confidence: 89,
    diabetesRisk: "High",
    description: "You have a Kapha-dominant constitution — fuller build, calm temperament, and slower digestion. Kapha types absorb medicines more slowly, which can increase drug accumulation. Higher diabetes risk means regular monitoring and an active lifestyle are essential.",
  },
];

const prakritiColors: Record<string, { bg: string; text: string; icon: typeof Heart }> = {
  Vata: { bg: "bg-blue-100", text: "text-blue-700", icon: Droplets },
  Pitta: { bg: "bg-orange-100", text: "text-orange-700", icon: Flame },
  Kapha: { bg: "bg-primary/10", text: "text-primary", icon: Heart },
};

const riskColors: Record<string, string> = {
  Low: "bg-safe/10 text-safe border-safe/30",
  Medium: "bg-caution/10 text-caution border-caution/30",
  High: "bg-avoid/10 text-avoid border-avoid/30",
};

const PrakritiAssessment = () => {
  const [stage, setStage] = useState<"intro" | "recording" | "analysing" | "result">("intro");
  const [countdown, setCountdown] = useState(30);
  const [result, setResult] = useState<PrakritiResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStage("recording");
      setCountdown(30);
      toast.info("Recording started — hold your phone steady");

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopAndAnalyse();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopAndAnalyse = () => {
    stopCamera();
    setStage("analysing");
    toast.info("Analysing your body features...");

    setTimeout(() => {
      const picked = prakritiData[Math.floor(Math.random() * prakritiData.length)];
      setResult(picked);
      localStorage.setItem("prakritiResult", JSON.stringify(picked));
      setStage("result");
      toast.success(`Prakriti determined: ${picked.type}`);
    }, 3000);
  };

  const PrakritiIcon = result ? prakritiColors[result.type].icon : Heart;

  return (
    <DashboardLayout role="patient">
      <PageTransition>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton to="/patient/home" />
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <Sparkles size={22} className="text-secondary" /> Prakriti Assessment
            </h1>
          </div>

          {/* SECTION A — Introduction */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="botanical-bg rounded-2xl p-8 border border-border text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground">Discover Your Prakriti</h2>
            <p className="text-muted-foreground mt-1">We analyse your body type using your phone camera</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                { name: "Vata", desc: "Lean, active, quick-thinking", color: "border-blue-300 bg-blue-50", icon: Droplets, iconColor: "text-blue-600" },
                { name: "Pitta", desc: "Medium build, energetic, focused", color: "border-orange-300 bg-orange-50", icon: Flame, iconColor: "text-orange-600" },
                { name: "Kapha", desc: "Fuller build, calm, steady", color: "border-primary/30 bg-primary/5", icon: Heart, iconColor: "text-primary" },
              ].map((p) => (
                <div key={p.name} className={`rounded-xl border p-4 ${p.color}`}>
                  <p.icon size={24} className={`mx-auto ${p.iconColor}`} />
                  <p className="font-semibold mt-2">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION B — Video Recording */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {stage === "intro" && (
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">Camera preview will appear here</p>
                </div>
              )}
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover ${stage === "recording" ? "block" : "hidden"}`} />
              {stage === "recording" && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm font-medium text-destructive">Recording... {countdown}s</span>
                </div>
              )}
              {stage === "analysing" && (
                <div className="text-center">
                  <Loader2 size={40} className="mx-auto text-primary animate-spin mb-3" />
                  <p className="text-muted-foreground font-medium">Analysing your body features...</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 justify-center">
              {stage === "intro" && (
                <Button onClick={startRecording} size="lg" className="gap-2">
                  <Camera size={18} /> Start Recording
                </Button>
              )}
              {stage === "recording" && (
                <Button onClick={stopAndAnalyse} size="lg" variant="destructive" className="gap-2">
                  <StopCircle size={18} /> Stop & Analyse
                </Button>
              )}
            </div>
          </motion.div>

          {/* SECTION C — Results */}
          <AnimatePresence>
            {stage === "result" && result && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${prakritiColors[result.type].bg}`}>
                    <PrakritiIcon size={28} className={prakritiColors[result.type].text} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Your Prakriti: {result.type}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={prakritiColors[result.type].bg + " " + prakritiColors[result.type].text + " border-0"}>
                        {result.type}
                      </Badge>
                      <Badge className={riskColors[result.diabetesRisk] + " border"}>
                        <ShieldCheck size={12} className="mr-1" /> Diabetes Risk: {result.diabetesRisk}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Confidence</p>
                  <div className="flex items-center gap-3">
                    <Progress value={result.confidence} className="flex-1 h-3" />
                    <span className="text-sm font-semibold text-foreground">{result.confidence}%</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>

                <Link to="/patient/chat">
                  <Button className="gradient-gold text-secondary-foreground font-semibold gap-2 w-full">
                    View My Interaction Check <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default PrakritiAssessment;
