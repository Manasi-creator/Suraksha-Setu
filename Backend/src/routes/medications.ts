import { Router, Response } from "express";
import MedicationRecord from "../models/MedicationRecord";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/medications/patient/:patientId
// @desc    Get all medications of a patient (separated by type)
router.get("/patient/:patientId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Patients can only see their own prescriptions
    if (req.user?.role === "patient" && req.user.id !== req.params.patientId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const records = await MedicationRecord.find({ patient: req.params.patientId });
    
    const modern = records.filter(r => r.type === "modern");
    const ayurvedic = records.filter(r => r.type === "ayurvedic");

    return res.json({ modern, ayurvedic });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/medications/patient/:patientId
// @desc    Add a medication to patient prescription list
router.post("/patient/:patientId", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { type, medicine, dosage, frequency, timing, notes } = req.body;

  try {
    // Only doctors or the patient (if permitted) can modify prescriptions. Normally doctors prescribe.
    if (req.user?.role === "patient" && req.user.id !== req.params.patientId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if medicine already prescribed
    const existing = await MedicationRecord.findOne({ patient: req.params.patientId, medicine });
    if (existing) {
      return res.status(400).json({ message: `${medicine} is already prescribed to this patient` });
    }

    const record = new MedicationRecord({
      patient: req.params.patientId,
      type,
      medicine,
      dosage,
      frequency,
      timing: timing || [],
      notes: notes || ""
    });

    await record.save();
    return res.status(201).json({ message: "Medication added successfully", record });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/medications/:id
// @desc    Remove a medication from prescription list
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const record = await MedicationRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Medication record not found" });
    }

    // Authorization
    if (req.user?.role === "patient" && req.user.id !== record.patient.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await MedicationRecord.findByIdAndDelete(req.params.id);
    return res.json({ message: "Medication removed successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
