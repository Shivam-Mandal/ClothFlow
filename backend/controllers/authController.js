import { AdminModel } from "../models/Admin.js";
import { WorkerModel } from "../models/Worker.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// Sign JWT
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, phone, dob, address, profileImageUrl } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
    const existingWorker = await WorkerModel.findOne({ email: email.toLowerCase() });
    if (existingAdmin || existingWorker)
      return res.status(409).json({ success: false, message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "admin") {
      newUser = new AdminModel({ name, email: email.toLowerCase(), password: hashedPassword, phone, profileImageUrl });
    } else {
      newUser = new WorkerModel({ name, email: email.toLowerCase(), password: hashedPassword, phone, dob, address, profileImageUrl });
    }

    await newUser.save();

    const token = signToken({ id: newUser._id, email: newUser.email, role });

    // set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: JWT_EXPIRES,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Missing email or password" });

    let user = await AdminModel.findOne({ email: email.toLowerCase() });
    let role = "admin";

    if (!user) {
      user = await WorkerModel.findOne({ email: email.toLowerCase() });
      role = "worker";
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = signToken({ id: user._id, email: user.email, role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: JWT_EXPIRES,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
