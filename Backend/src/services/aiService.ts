import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export interface AiAnalysisResult {
  summary: string;
  confidence: number;
  riskLevel: "Low" | "Moderate" | "High";
  verdict: "Safe" | "Use with Caution" | "Unsafe";
  reasons: string[];
  recommendations: string[];
}

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are a helpful assistant for ordinary patients. Always answer with valid JSON only. Never include markdown, code fences, or explanations outside JSON. Do not hallucinate. If information is uncertain, say so in the summary and lower the confidence. Use short, simple English. Keep the explanation under 3 sentences. Mention only the most important risks. Prefer patient-friendly language. Mention emergency situations only when necessary. Return a JSON object matching this exact shape:
{
  "summary": "2-3 sentence explanation in very simple English.",
  "confidence": 92,
  "riskLevel": "Low | Moderate | High",
  "verdict": "Safe | Use with Caution | Unsafe",
  "reasons": ["...", "...", "..."],
  "recommendations": ["...", "...", "..."]
}`;

const sanitizeJson = (raw: string): AiAnalysisResult => {
  const normalized = raw.trim();
  const firstBrace = normalized.indexOf("{");
  const lastBrace = normalized.lastIndexOf("}");
  const jsonText = firstBrace >= 0 && lastBrace > firstBrace ? normalized.slice(firstBrace, lastBrace + 1) : normalized;
  const parsed = JSON.parse(jsonText);

  return {
    summary: String(parsed.summary || "The information is limited, so please ask a healthcare professional for advice."),
    confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 70)),
    riskLevel: parsed.riskLevel === "High" ? "High" : parsed.riskLevel === "Moderate" ? "Moderate" : "Low",
    verdict: parsed.verdict === "Unsafe" ? "Unsafe" : parsed.verdict === "Use with Caution" ? "Use with Caution" : "Safe",
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((item: unknown) => String(item)).slice(0, 3) : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map((item: unknown) => String(item)).slice(0, 3) : []
  };
};

export const analyzeMedicineInteraction = async (
  modernMedicine: string,
  ayurvedicMedicine: string,
  context?: string
): Promise<AiAnalysisResult> => {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `Analyze this medicine interaction for a general patient with limited medical knowledge. Modern medicine: ${modernMedicine}. Ayurvedic medicine: ${ayurvedicMedicine}. Context: ${context || "No extra context provided."}. Return JSON only.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }]
  });

  const text = response.text || "";
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return sanitizeJson(text);
};
