// middlewares/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * verifyToken - middleware that ensures a valid JWT exists.
 * Reads token from:
 *  - Authorization header: "Bearer <token>"
 *  - Cookie named "token"
 *
 * On success: sets req.user = { id, email, role, iat, exp } and calls next()
 * On failure: responds 401 JSON with an error message
 */
export const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // 1) Authorization header (Bearer)
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Cookie fallback
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach minimal user info to request for downstream usage
    req.user = {
      id: payload.id || payload._id || payload.userId,
      email: payload.email,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };

    return next();
  } catch (err) {
    // Distinguish expired token from other errors (optional)
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Access token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid access token" });
  }
};

/**
 * requireRole - returns middleware that enforces a specific role (or roles).
 * Usage:
 *   router.get('/admin-only', verifyToken, requireRole('admin'), handler);
 *
 * Accepts either a string role or an array of roles.
 */
export const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient privileges" });
    }

    return next();
  };
};
