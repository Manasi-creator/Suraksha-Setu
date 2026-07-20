import { Router, Response } from "express";
import MedicationRecord from "../models/MedicationRecord";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";
import PatientProfile from "../models/PatientProfile";

const router = Router();

// Static Rule-Based Interaction Database
interface InteractionRule {
  modern: string;
  ayurvedic: string;
  severity: "safe" | "caution" | "avoid";
  reason: string;
  confidence: number;
}

const interactionRules: InteractionRule[] = [
  {
    modern: "metformin",
    ayurvedic: "karela (bitter gourd)",
    severity: "caution",
    reason: "Both Metformin and Karela juice lower blood sugar through different mechanisms — Metformin via AMPK pathway, Karela via charantin and polypeptide-P. Combined use may cause additive hypoglycaemic effect, especially if Karela juice is consumed in concentrated form (>150ml). Recommend monitoring fasting blood sugar daily and reducing Karela to 100ml if values drop below 90 mg/dL.",
    confidence: 78
  },
  {
    modern: "metformin",
    ayurvedic: "karela",
    severity: "caution",
    reason: "Both Metformin and Karela juice lower blood sugar through different mechanisms — Metformin via AMPK pathway, Karela via charantin and polypeptide-P. Combined use may cause additive hypoglycaemic effect, especially if Karela juice is consumed in concentrated form (>150ml). Recommend monitoring fasting blood sugar daily and reducing Karela to 100ml if values drop below 90 mg/dL.",
    confidence: 78
  },
  {
    modern: "glipizide",
    ayurvedic: "karela (bitter gourd)",
    severity: "avoid",
    reason: "Glipizide is a strong sulfonylurea that stimulates insulin secretion. Karela juice has active compounds (charantin/polypeptide-p) that also mimic insulin. Combining them leads to a high risk of sudden and severe hypoglycemic episodes (blood sugar < 70 mg/dL). Avoid this combination or substitute Karela with a milder herb.",
    confidence: 85
  },
  {
    modern: "glipizide",
    ayurvedic: "karela",
    severity: "avoid",
    reason: "Glipizide is a strong sulfonylurea that stimulates insulin secretion. Karela juice has active compounds (charantin/polypeptide-p) that also mimic insulin. Combining them leads to a high risk of sudden and severe hypoglycemic episodes (blood sugar < 70 mg/dL). Avoid this combination or substitute Karela with a milder herb.",
    confidence: 85
  },
  {
    modern: "metformin",
    ayurvedic: "madhunashini vati",
    severity: "avoid",
    reason: "Madhunashini Vati is a potent polyherbal compound containing Gurmar, Karela, and Neem. Combining it with Metformin 500mg/1000mg causes severe double-action hypoglycemic risk. Discontinue Madhunashini Vati immediately under modern prescription.",
    confidence: 90
  },
  {
    modern: "glipizide",
    ayurvedic: "madhunashini vati",
    severity: "avoid",
    reason: "Glipizide stimulates insulin release and Madhunashini Vati enhances islet cell function and glucose uptake. Combined use can trigger severe, symptomatic hypoglycemia (dizziness, sweating, confusion). Highly recommended to avoid.",
    confidence: 92
  },
  {
    modern: "metformin",
    ayurvedic: "methi (fenugreek)",
    severity: "safe",
    reason: "Methi seeds combination with Metformin is generally safe and well-tolerated. Fenugreek slows down glucose absorption in the gut. Monitor blood sugar levels to see if a lower Metformin dose is possible over time.",
    confidence: 80
  },
  {
    modern: "metformin",
    ayurvedic: "methi",
    severity: "safe",
    reason: "Methi seeds combination with Metformin is generally safe and well-tolerated. Fenugreek slows down glucose absorption in the gut. Monitor blood sugar levels to see if a lower Metformin dose is possible over time.",
    confidence: 80
  },
  {
    modern: "sitagliptin",
    ayurvedic: "methi (fenugreek)",
    severity: "safe",
    reason: "Generally safe. AI indicates no significant compound interactions. Ensure patient maintains regular kidney function checks as a standard procedure for chronic management.",
    confidence: 75
  },
  {
    modern: "sitagliptin",
    ayurvedic: "methi",
    severity: "safe",
    reason: "Generally safe. AI indicates no significant compound interactions. Ensure patient maintains regular kidney function checks as a standard procedure for chronic management.",
    confidence: 75
  },
  {
    modern: "insulin",
    ayurvedic: "neem (azadirachta indica)",
    severity: "caution",
    reason: "Neem contains nimbin and nimbidin, which can synergistically lower blood glucose. When combined with direct insulin administration, this increase risk of hypoglycemic shock. Close monitoring is advised.",
    confidence: 80
  },
  {
    modern: "insulin",
    ayurvedic: "neem",
    severity: "caution",
    reason: "Neem contains nimbin and nimbidin, which can synergistically lower blood glucose. When combined with direct insulin administration, this increase risk of hypoglycemic shock. Close monitoring is advised.",
    confidence: 80
  }
];

const checkInteraction = (modernName: string, ayurvedicName: string) => {
  const mod = modernName.toLowerCase().trim();
  const ayur = ayurvedicName.toLowerCase().trim();

  // Find exact or partial match rules
  const foundRule = interactionRules.find(r => 
    (mod.includes(r.modern) || r.modern.includes(mod)) && 
    (ayur.includes(r.ayurvedic) || r.ayurvedic.includes(ayur))
  );

  if (foundRule) {
    return {
      severity: foundRule.severity,
      reason: foundRule.reason,
      confidence: foundRule.confidence
    };
  }

  // Default fallback if no known rule exists
  return {
    severity: "safe" as const,
    reason: "No known clinical interaction records exist for this combination. Ensure proper separation of dosing times (minimum 2 hours gap) to avoid physical absorption interference in the stomach.",
    confidence: 60
  };
};

// @route   POST /api/interactions/check
// @desc    Evaluate custom pair of drugs
router.post("/check", authenticateToken, (req: AuthRequest, res: Response) => {
  const { modern, ayurvedic } = req.body;

  if (!modern || !ayurvedic) {
    return res.status(400).json({ message: "Both modern medicine and ayurvedic formulation are required" });
  }

  const result = checkInteraction(modern, ayurvedic);
  return res.json({
    modern,
    ayurvedic,
    ...result
  });
});

// @route   GET /api/interactions/patient/:patientId
// @desc    Check all active patient medications for interactions
router.get("/patient/:patientId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const meds = await MedicationRecord.find({ patient: req.params.patientId });
    const modern = meds.filter(m => m.type === "modern");
    const ayurvedic = meds.filter(m => m.type === "ayurvedic");

    const reports: any[] = [];
    let highRiskCount = 0;

    for (const m of modern) {
      for (const a of ayurvedic) {
        const result = checkInteraction(m.medicine, a.medicine);
        if (result.severity !== "safe") {
          reports.push({
            modernDrug: m.medicine,
            ayurvedic: a.medicine,
            severity: result.severity === "avoid" ? "Avoid" : "Caution",
            message: result.reason,
            confidence: result.confidence
          });
          if (result.severity === "avoid") highRiskCount++;
        }
      }
    }

    return res.json({
      patientId: req.params.patientId,
      hasConflicts: reports.length > 0,
      highRiskCount,
      conflicts: reports
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/interactions/doctor
// @desc    Get all interaction conflicts for a doctor's assigned patients
router.get("/doctor", authenticateToken, requireRole(["doctor"]), async (req: AuthRequest, res: Response) => {
  try {
    const doctorName = req.user?.name;
    const profiles = await PatientProfile.find({ assignedDoctor: doctorName }).populate("user", "name email");
    
    const allConflicts: any[] = [];
    
    for (const profile of profiles) {
      if (!profile.user) continue;
      
      const meds = await MedicationRecord.find({ patient: (profile.user as any)._id });
      const modern = meds.filter(m => m.type === "modern");
      const ayurvedic = meds.filter(m => m.type === "ayurvedic");
      
      for (const m of modern) {
        for (const a of ayurvedic) {
          const result = checkInteraction(m.medicine, a.medicine);
          if (result.severity !== "safe") {
            allConflicts.push({
              patientId: (profile.user as any)._id,
              patientName: (profile.user as any).name,
              modernDrug: m.medicine,
              ayurvedic: a.medicine,
              severity: result.severity === "avoid" ? "Avoid" : "Caution",
              message: result.reason,
              confidence: result.confidence,
              date: m.createdAt > a.createdAt ? m.createdAt : a.createdAt // rough estimate of interaction start
            });
          }
        }
      }
    }

    // Sort by most recent
    allConflicts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return res.json(allConflicts);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
