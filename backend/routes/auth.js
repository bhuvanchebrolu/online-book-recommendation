import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/**
 * STEP 1: MANUAL REDIRECT TO DAUTH
 */
router.get("/dauth", (req, res) => {
  const redirectUri = encodeURIComponent(
    "http://localhost:8080/auth/dauth/callback",
  );

  const scope = encodeURIComponent("openid email profile user");

  res.redirect(
    `https://auth.delta.nitt.edu/authorize?` +
      `response_type=code&` +
      `client_id=${process.env.DAUTH_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `state=dauth`,
  );
});

/**
 * STEP 2: PASSPORT HANDLES CALLBACK
 */
router.get(
  "/dauth/callback",
  passport.authenticate("oauth2", { session: false }),
  async (req, res) => {
    try {
      const { email, name } = req.user;

      const rollRegex = /^\d{6,9}@nitt\.edu$/;
      let role = "professor";

      if (rollRegex.test(email)) {
        role = "student";
      } else {
        const existing = await User.findOne({ email });
        if (existing) role = existing.role;
      }

      const user = await User.findOneAndUpdate(
        { email },
        { name, email, role },
        { upsert: true, new: true },
      );

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      // ✅ SECURE COOKIE
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect("http://localhost:5173/login-success");
    } catch (err) {
      console.error(err);
      res.status(500).send("Authentication failed");
    }
  },
);
router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select("-_id name email role");
  res.json(user);
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});


export default router;
