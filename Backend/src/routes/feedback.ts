import { Router, Response } from "express";
import Feedback from "../models/Feedback";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/feedback
// @desc    Get all feedback records (admin only)
router.get("/", authenticateToken, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const feedback = await Feedback.find().sort({ date: -1 });
    return res.json(feedback);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/feedback
// @desc    Submit feedback on AI result
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { doctor, patient, drugsChecked, aiResult, assessment, note } = req.body;

  try {
    const feedback = new Feedback({
      doctor: doctor || "Anonymous Doctor",
      patient,
      drugsChecked,
      aiResult,
      assessment,
      note,
      status: "Pending"
    });

    await feedback.save();
    return res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/feedback/:id/status
// @desc    Update feedback status (admin only)
router.put("/:id/status", authenticateToken, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  if (!["Pending", "Reviewed", "Escalated"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.status = status;
    await feedback.save();

    return res.json({ message: "Feedback status updated", feedback });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
