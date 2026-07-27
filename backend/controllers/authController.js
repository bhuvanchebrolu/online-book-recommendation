import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendMail.js";

// ── Helpers ──────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const setCookie = (res, token) =>
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
// ── STEP 1: Send OTP ─────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // if (!email.endsWith("@nitt.edu"))
    //   return res.status(400).json({ message: "Only @nitt.edu emails are allowed" });

    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already registered. Please login." });

    const otp = Otp.generate();
    await Otp.save(email, otp);
    console.log(otp);
    const expiry = process.env.OTP_EXPIRY_MINUTES || 10;

    await sendEmail({
      to:      email,
      subject: "Your OTP — NITT LibRecommend",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:32px;">📚</span>
            <h2 style="color:#1a3a5c;margin:8px 0 4px;">NITT LibRecommend</h2>
            <p style="color:#7a93ab;font-size:13px;margin:0;">Email Verification</p>
          </div>
          <p style="color:#374151;font-size:14px;">Use the OTP below to verify your email address. It expires in <strong>${expiry} minutes</strong>.</p>
          <div style="background:#f0f4f8;border-radius:10px;padding:28px;text-align:center;margin:24px 0;">
            <span style="font-size:40px;font-weight:700;letter-spacing:14px;color:#1a3a5c;">${otp}</span>
          </div>
          <p style="color:#adb5bd;font-size:12px;text-align:center;">If you did not request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
          <p style="color:#adb5bd;font-size:11px;text-align:center;">© ${new Date().getFullYear()} National Institute of Technology, Tiruchirappalli</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ── STEP 2: Verify OTP ───────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const valid = await Otp.verify(email, otp);

    if (!valid)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ── STEP 3: Register ─────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    if (!name || !email || !password || !department || !role)
      return res.status(400).json({ message: "All fields are required" });

    if (!["professor", "hod"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    // Gate: email must have been OTP-verified
    const verified = await Otp.isVerified(email);
    if (!verified)
      return res.status(403).json({ message: "Email not verified. Please verify OTP first." });

    // No duplicate accounts
    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already registered. Please login." });

    const user = await User.create({ name, email, password, role, department });

    // Cleanup OTP
    await Otp.deleteByEmail(email);

    //Welcome email (non-blocking)
    sendEmail({
      to:      email,
      subject: "Welcome to NITT LibRecommend",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:32px;">📚</span>
            <h2 style="color:#1a3a5c;margin:8px 0 4px;">Welcome, ${name}!</h2>
          </div>
          <p style="color:#374151;font-size:14px;">Your account has been created successfully.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#6b7280;font-size:13px;">Role</td><td style="padding:8px;font-weight:600;color:#1a3a5c;">${role.toUpperCase()}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;font-size:13px;">Department</td><td style="padding:8px;font-weight:600;color:#1a3a5c;">${department}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;font-size:13px;">Email</td><td style="padding:8px;font-weight:600;color:#1a3a5c;">${email}</td></tr>
          </table>
          <p style="color:#374151;font-size:14px;">You can now <a href="http://localhost:5173/login" style="color:#2e6da4;">sign in</a> to the portal.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
          <p style="color:#adb5bd;font-size:11px;text-align:center;">© ${new Date().getFullYear()} National Institute of Technology, Tiruchirappalli</p>
        </div>
      `,
    }).catch(console.error);

    const token = signToken(user);
    setCookie(res, token);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id:         user.id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ── Login ────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // ── Admin login (hardcoded credentials from .env) ──
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const admin = await User.upsert({
        name:       "Admin",
        email:      process.env.ADMIN_EMAIL,
        role:       "admin",
        department: "CSE",
      });

      const token = signToken(admin);
      setCookie(res, token);

      return res.json({
        message: "Login successful",
        user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      });
    }

    // ── Regular user login ──
    const user = await User.findByEmail(email);

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (!user.password)
      return res.status(401).json({ message: "Please use DAuth (NITT SSO) to login" });

    const valid = await User.verifyPassword(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    setCookie(res, token);

    res.json({
      message: "Login successful",
      user: {
        id:         user.id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ── Get current user ─────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      department: user.department,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ── Logout ───────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
};