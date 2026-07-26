import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  console.log("=== AUTH START ===");
  console.log("Cookies:", req.cookies);
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);
  console.log("TOKEN:", token);
  if (!token) {
    console.log("NO TOKEN");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
    const user = await User.findById(decoded.id);
    console.log("USER:", user);
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({ message: "User not found" });
    }
    req.user = {
      id: user.id,
      role: user.role,
      department: user.department,
      name: user.name,
      email: user.email,
    };
    console.log("AUTH SUCCESS");
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };

export const blockStudents = (req, res, next) => {
  if (req.user.role === "student")
    return res
      .status(403)
      .json({ message: "Students cannot access this resource" });
  next();
};
