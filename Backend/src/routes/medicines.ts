import { Router, Response } from "express";
import Medicine from "../models/Medicine";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/medicines
// @desc    Get all medicines from directory with optional search & filter
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { q, type } = req.query;

  try {
    let filter: any = {};
    if (q) {
      filter.name = { $regex: q as string, $options: "i" };
    }
    if (type) {
      filter.type = type;
    }

    const medicines = await Medicine.find(filter);
    return res.json(medicines);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/medicines
// @desc    Add a medicine to directory
router.post("/", authenticateToken, requireRole(["doctor", "admin"]), async (req: AuthRequest, res: Response) => {
  const { name, compounds, category, type, status } = req.body;

  try {
    // Check if medicine already exists
    let existing = await Medicine.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Medicine already exists in registry" });
    }

    const medicine = new Medicine({
      name,
      compounds,
      category,
      type,
      status: status || (req.user?.role === "admin" ? "Verified" : "Needs Review")
    });

    await medicine.save();
    return res.status(201).json({ message: "Medicine added to directory", medicine });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/medicines/:id/verify
// @desc    Verify a medicine status
router.put("/:id/verify", authenticateToken, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.status = "Verified";
    await medicine.save();

    return res.json({ message: "Medicine status verified successfully", medicine });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/medicines/:id
// @desc    Delete a medicine from directory
router.delete("/:id", authenticateToken, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    return res.json({ message: "Medicine deleted from directory" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
