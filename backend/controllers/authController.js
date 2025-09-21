// controllers/authController.js
import { AdminModel } from "../models/Admin.js";
import { WorkerModel } from "../models/Worker.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh");

const ACCESS_EXPIRES = "15m"; 
const REFRESH_EXPIRES = "7d"; 

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

/**
 * Helper: attach a refresh token hash to user document (rotation-friendly)
 * We store an array `refreshTokens` on the user:
 *  [{ tokenHash, expiresAt, createdAt, revoked }]
 */
async function storeRefreshTokenForUser(user, refreshToken) {
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days 
  
  if (!user.refreshTokens || !Array.isArray(user.refreshTokens)) {
    user.refreshTokens = [];
  }
  user.refreshTokens.push({
    tokenHash,
    expiresAt,
    createdAt: new Date(),
    revoked: false,
  });
  await user.save();
}

/**
 * Find and validate a refresh token stored on user
 * returns { user, matchedRecordIndex } or null
 */
async function findValidRefreshToken(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const userId = payload.id || payload.userId || payload._id;
    if (!userId) return null;

    // find user
    let user = await AdminModel.findById(userId);
    let role = "admin";
    if (!user) {
      user = await WorkerModel.findById(userId);
      role = "worker";
    }
    if (!user) return null;

    if (!user.refreshTokens || user.refreshTokens.length === 0) return null;

    // check stored refresh tokens (hash compare)
    for (let i = user.refreshTokens.length - 1; i >= 0; i--) {
      const rec = user.refreshTokens[i];
      if (rec.revoked) continue;
      if (rec.expiresAt && new Date(rec.expiresAt) < new Date()) continue;

      const matches = await bcrypt.compare(refreshToken, rec.tokenHash);
      if (matches) {
        return { user, role, index: i, record: rec };
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone,profileImageUrl, role, dob, address } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, password, and role are required" });
    }

    // check if email already exists
    const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
    const existingWorker = await WorkerModel.findOne({ email: email.toLowerCase() });
    if (existingAdmin || existingWorker) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "admin") {
      newUser = new AdminModel({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        profileImageUrl,
        phone,
      });
    } else if (role === "worker") {
      newUser = new WorkerModel({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        profileImageUrl,
        dob,
        address,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    await newUser.save();

    // prepare response (no password)
    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      profileImageUrl: newUser.profileImageUrl,
      role,
      ...(role === "worker" && { dob: newUser.dob, address: newUser.address }),
    };

    return res.status(201).json({
      success: true,
      message: `${role} account created successfully`,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    let user = await AdminModel.findOne({ email: email.toLowerCase() });
    let role = "admin";

    if (!user) {
      user = await WorkerModel.findOne({ email: email.toLowerCase() });
      role = "worker";
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const payload = { id: user._id, email: user.email, role };

    // Create tokens
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store hash of refresh token on user for revocation + rotation
    await storeRefreshTokenForUser(user, refreshToken);

    // Set refresh token as httpOnly cookie (browser will send on /refresh)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Prepare user data to return
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role,
      ...(role === "worker" && { dob: user.dob, address: user.address }),
    };

    // Return access token in body 
    return res.status(200).json({
      success: true,
      message: `${role} login successful`,
      accessToken,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
};

/**
 * POST /auth/refresh
 * Reads refresh token from httpOnly cookie, validates, rotates and returns a new access token (+ rotates refresh token cookie)
 */
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token" });

    const found = await findValidRefreshToken(refreshToken);
    if (!found) return res.status(401).json({ success: false, message: "Invalid or revoked refresh token" });

    const { user, role, index } = found;

    // Revoke the current stored refresh token record (rotation)
    user.refreshTokens[index].revoked = true;

    // Issue new tokens
    const payload = { id: user._id, email: user.email, role };
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    // store new refresh token hash
    await storeRefreshTokenForUser(user, newRefreshToken);

    // Save revocation + new token on user
    await user.save();

    // set new refresh cookie (rotated)
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Could not refresh token" });
  }
};

/**
 * Logout: revoke refresh token (if present) and clear cookie
 */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const found = await findValidRefreshToken(refreshToken);
      if (found) {
        const { user, index } = found;
        user.refreshTokens[index].revoked = true;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Logout failed" });
  }
};

