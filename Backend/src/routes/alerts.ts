import { Router, Response } from "express";
import Alert from "../models/Alert";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";
import PatientProfile from "../models/PatientProfile";

const router = Router();

// @route   GET /api/alerts/patient/:patientId
// @desc    Get all alerts for a patient
router.get("/patient/:patientId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === "patient" && req.user.id !== req.params.patientId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const alerts = await Alert.find({ patient: req.params.patientId }).sort({ date: -1 });
    return res.json(alerts);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/alerts/doctor
// @desc    Get all alerts for all patients assigned to the logged-in doctor
router.get("/doctor", authenticateToken, requireRole(["doctor"]), async (req: AuthRequest, res: Response) => {
  try {
    const doctorName = req.user?.name;
    const profiles = await PatientProfile.find({ assignedDoctor: doctorName });
    const patientIds = profiles.map(p => p.user);

    // Fetch alerts for all these patients and populate the patient data
    const alerts = await Alert.find({ patient: { $in: patientIds } })
      .populate("patient", "name email")
      .sort({ date: -1 });
      
    return res.json(alerts);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/alerts/patient/:patientId
// @desc    Create a new alert for a patient
router.post("/patient/:patientId", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { severity, message, sentBy } = req.body;

  try {
    const alert = new Alert({
      patient: req.params.patientId,
      severity,
      message,
      sentBy: sentBy || (req.user?.role === "doctor" ? "Doctor" : "AI System"),
      status: "Unread"
    });

    await alert.save();
    return res.status(201).json({ message: "Alert created successfully", alert });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/alerts/:id/read
// @desc    Mark an alert as Read
router.put("/:id/read", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    if (req.user?.role === "patient" && req.user.id !== alert.patient.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    alert.status = "Read";
    await alert.save();

    return res.json({ message: "Alert marked as read", alert });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
