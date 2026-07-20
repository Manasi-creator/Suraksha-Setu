import { Router, Response } from "express";
import User from "../models/User";
import PatientProfile from "../models/PatientProfile";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/patients
// @desc    Get list of all patients with profiles
router.get("/", authenticateToken, requireRole(["doctor", "admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-passwordHash");
    
    const patientsWithProfiles = await Promise.all(
      patients.map(async (patient) => {
        const profile = await PatientProfile.findOne({ user: patient._id });
        return {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          dateJoined: patient.dateJoined,
          assignedDoctor: profile?.assignedDoctor || "Dr. Priya Sharma",
          status: profile?.status || "Active",
          age: profile?.age,
          gender: profile?.gender,
          height: profile?.height,
          weight: profile?.weight,
          profileCompletion: profile?.profileCompletion || 50
        };
      })
    );

    return res.json(patientsWithProfiles);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/patients/doctors
// @desc    Get all doctors
router.get("/doctors", authenticateToken, requireRole(["admin"]), async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-passwordHash");
    const docs = doctors.map(d => ({
      id: d._id,
      name: d.name,
      email: d.email,
      clinic: "Ayushman Ayurveda Clinic",
      phone: "+91-98765-43210",
      status: "Active",
      dateJoined: new Date(d.dateJoined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    }));
    return res.json(docs);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/patients/:id
// @desc    Get detailed patient profile
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Only doctors, admins, or the patient themselves can fetch this profile
    if (req.user?.role === "patient" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const patient = await User.findById(req.params.id).select("-passwordHash");
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    let profile = await PatientProfile.findOne({ user: patient._id });
    if (!profile) {
      // Auto-create profile if missing
      profile = new PatientProfile({ user: patient._id });
      await profile.save();
    }

    return res.json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      dateJoined: patient.dateJoined,
      assignedDoctor: profile.assignedDoctor,
      status: profile.status,
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      profileCompletion: profile.profileCompletion
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient profile
router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { age, gender, height, weight, assignedDoctor, status } = req.body;

  try {
    // Authorization check
    if (req.user?.role === "patient" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    let profile = await PatientProfile.findOne({ user: patient._id });
    if (!profile) {
      profile = new PatientProfile({ user: patient._id });
    }

    // Update fields
    if (age !== undefined) profile.age = age;
    if (gender !== undefined) profile.gender = gender;
    if (height !== undefined) profile.height = height;
    if (weight !== undefined) profile.weight = weight;
    if (assignedDoctor !== undefined) profile.assignedDoctor = assignedDoctor;
    if (status !== undefined) profile.status = status;

    // Calculate dynamic completion score
    let fields = [profile.age, profile.gender, profile.height, profile.weight];
    let filledFields = fields.filter(f => f !== undefined && f !== null && f !== "");
    profile.profileCompletion = Math.min(100, 50 + Math.round((filledFields.length / fields.length) * 50));

    await profile.save();

    return res.json({
      message: "Profile updated successfully",
      profile: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        assignedDoctor: profile.assignedDoctor,
        status: profile.status,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        profileCompletion: profile.profileCompletion
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
