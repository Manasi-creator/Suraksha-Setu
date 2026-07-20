import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { analyzeMedicineInteraction } from "../services/aiService";

const router = Router();

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const isPromptInjectionAttempt = (value: string) => {
  const suspicious = /ignore previous|ignore above|system prompt|developer message|override instructions|act as|you are now|assistant role|forget everything/i;
  return suspicious.test(value);
};

const enforceRateLimit = (req: AuthRequest, res: Response, next: () => void) => {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").replace(/[^0-9a-zA-Z]/g, "_");
  const now = Date.now();
  const bucket = rateLimitMap.get(ip);

  if (bucket && bucket.resetAt > now) {
    if (bucket.count >= 10) {
      return res.status(429).json({ message: "Too many requests. Please wait a moment and try again." });
    }
    bucket.count += 1;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
  }

  next();
};

router.post("/analyze", authenticateToken, enforceRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const { modernMedicine, ayurvedicMedicine, context } = req.body || {};

    if (!modernMedicine || !ayurvedicMedicine) {
      return res.status(400).json({ message: "Both modernMedicine and ayurvedicMedicine are required" });
    }

    const text = String(modernMedicine).trim();
    const herbal = String(ayurvedicMedicine).trim();
    const userContext = typeof context === "string" ? context : "";

    if (!text || !herbal) {
      return res.status(400).json({ message: "Medicine names must be non-empty strings" });
    }

    if (isPromptInjectionAttempt(text) || isPromptInjectionAttempt(herbal) || isPromptInjectionAttempt(userContext)) {
      return res.status(400).json({ message: "The request could not be processed safely." });
    }

    if (text.length > 200 || herbal.length > 200 || userContext.length > 1000) {
      return res.status(400).json({ message: "Request content is too long" });
    }

    const result = await analyzeMedicineInteraction(text, herbal, userContext);
    return res.json(result);
  } catch (error: any) {
    console.error("AI analysis failed", error);
    return res.status(502).json({
      message: "The AI service is currently unavailable. Please try again later.",
      error: error.message
    });
  }
});

export default router;
