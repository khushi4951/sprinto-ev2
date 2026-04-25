const { MongoStore } = require("connect-mongo");

function buildSessionConfig() {
  const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sprinto-ev2";

  return {
    name: "sprinto.sid",
    secret: process.env.SESSION_SECRET || "sprinto-dev-session-secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl,
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
    }),
  };
}

module.exports = { buildSessionConfig };
