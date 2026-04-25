const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { createUser, getUserByEmail, getUserById } = require("../data/store");

const JWT_SECRET = process.env.JWT_SECRET || "sprinto-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function publicUser(user) {
  return {
    id: user.id || (user._id ? user._id.toString() : undefined),
    email: user.email,
    name: user.name,
    role: user.role || "member",
    createdAt: user.createdAt,
  };
}

async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body || {};

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Conflict", message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await createUser({ email: String(email), passwordHash, name: name ? String(name) : undefined });
    const userId = user._id ? user._id.toString() : user.id;
    const token = jwt.sign({ sub: userId, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    req.session.userId = userId;
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.status(201).json({ user: publicUser({ ...user, id: userId }), token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }

    const userId = user._id ? user._id.toString() : user.id;
    const token = jwt.sign({ sub: userId, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    req.session.userId = userId;
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ user: publicUser({ ...user, id: userId }), token });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    req.session.destroy(() => {});
    res.clearCookie("token");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "NotFound", message: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, logout, me };

