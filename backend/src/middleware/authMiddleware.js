const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { store } = require("../services/dataStore");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token required", details: {} });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = store.users.find((entry) => entry.id === payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists", details: {} });
    }
    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token", details: {} });
  }
}

module.exports = { authMiddleware };
