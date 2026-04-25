const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "sprinto-dev-secret";

async function resolveUserById(userId) {
  if (!userId) return null;
  const user = await User.findById(userId);
  return user ? user.toJSON() : null;
}

async function requireAuth(req, res, next) {
  try {
    let userId = req.session && req.session.userId;

    if (!userId) {
      const header = req.get("authorization");
      if (header && header.startsWith("Bearer ")) {
        const token = header.slice("Bearer ".length);
        const payload = jwt.verify(token, JWT_SECRET);
        userId = payload.sub;
      } else if (req.cookies && req.cookies.token) {
        const payload = jwt.verify(req.cookies.token, JWT_SECRET);
        userId = payload.sub;
      }
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized", message: "Missing authentication" });
    }

    const user = await resolveUserById(userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid authentication" });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid authentication token" });
  }
}

async function requireViewAuth(req, res, next) {
  try {
    let userId = req.session && req.session.userId;

    if (!userId && req.cookies && req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, JWT_SECRET);
      userId = payload.sub;
    }

    if (!userId) return res.redirect("/login");
    const user = await resolveUserById(userId);
    if (!user) return res.redirect("/login");

    req.user = user;
    return next();
  } catch (err) {
    return res.redirect("/login");
  }
}

module.exports = { requireAuth, requireViewAuth };

