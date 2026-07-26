import express from "express";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/send-otp",   sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register",   register);
router.post("/login",      login);
router.post("/logout",     logout);
router.get("/me",          authenticate, getMe);

// Dev only
router.post("/dev/change-role", authenticate, async (req, res) => {
  const { role } = req.body;
  if (!["student", "professor", "hod", "admin"].includes(role))
    return res.status(400).json({ message: "Invalid role" });
  try {
    const user = await User.updateRole(req.user.id, role);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user });
  } catch {
    res.status(500).json({ message: "Failed to update role" });
  }
});

export default router;