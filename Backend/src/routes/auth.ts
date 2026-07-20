import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import PatientProfile from "../models/PatientProfile";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "suraksha_setu_secret_key_12345";

// @route   POST /api/auth/register
// @desc    Register a new user (patient, doctor, admin)
router.post("/register", async (req: AuthRequest, res: Response) => {
  const { name, email, password, role, age, gender, height, weight, assignedDoctor } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      passwordHash,
      role
    });

    await user.save();

    // If patient, initialize profile
    if (role === "patient") {
      const patientProfile = new PatientProfile({
        user: user._id,
        age: age || undefined,
        gender: gender || undefined,
        height: height || undefined,
        weight: weight || undefined,
        assignedDoctor: assignedDoctor || "Dr. Priya Sharma",
        profileCompletion: 50,
        status: "Active"
      });
      await patientProfile.save();
    }

    // Generate token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// @route   PUT /api/auth/me
// @desc    Update current user profile details
router.put("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, age, gender, height, weight, clinicName, phone, assignedDoctor, status } = req.body;

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (clinicName !== undefined) user.clinicName = clinicName;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    let profile = null;
    if (user.role === "patient") {
      profile = await PatientProfile.findOne({ user: user._id });
      if (!profile) {
        profile = new PatientProfile({ user: user._id });
      }

      if (age !== undefined) profile.age = age;
      if (gender !== undefined) profile.gender = gender;
      if (height !== undefined) profile.height = height;
      if (weight !== undefined) profile.weight = weight;
      if (assignedDoctor !== undefined) profile.assignedDoctor = assignedDoctor;
      if (status !== undefined) profile.status = status;

      const fields = [profile.age, profile.gender, profile.height, profile.weight];
      const filledFields = fields.filter((field) => field !== undefined && field !== null && field !== "");
      profile.profileCompletion = Math.min(100, 50 + Math.round((filledFields.length / fields.length) * 50));
      await profile.save();
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        clinicName: user.clinicName,
        phone: user.phone
      },
      profile
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
router.get("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = null;
    if (user.role === "patient") {
      profile = await PatientProfile.findOne({ user: user._id });
    }

    return res.json({
      user,
      profile
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
