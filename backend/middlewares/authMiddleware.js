
export const authenticateAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.itoken) {
      token = req.cookies.itoken;
    }

    if (!token) return res.status(401).json({ success: false, message: "No access token provided" });

    const payload = jwt.verify(token, ACCESS_SECRET);
    req.userId = payload.id || payload.userId || payload._id;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired access token" });
  }
};
