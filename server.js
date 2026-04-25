/**
 * Sprint Management App (Express + Vanilla JS SPA)
 *
 * Client-Server Architecture (high level):
 * - Client: a Single Page Application (HTML/CSS/JS) served from `/public`
 * - Server: Express REST APIs under `/api/*` that return JSON
 * - Data: stored in MongoDB via Mongoose models
 *
 * Request Lifecycle (high level):
 * - Incoming request -> logger middleware -> JSON body parsing -> routing -> controller -> JSON response
 * - Errors bubble to centralized error-handling middleware
 */
require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const {
    Server
} = require("socket.io");

const {
    logger
} = require("./middleware/logger");
const {
    errorHandler,
    notFound
} = require("./middleware/errorHandler");
const {
    connectDatabase
} = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sprintRoutes = require("./routes/sprintRoutes");
const issueRoutes = require("./routes/issueRoutes");
const teamRoutes = require("./routes/teamRoutes");
const viewRoutes = require("./routes/viewRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.set("io", io);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Step 1: application-level middleware
// Middleware runs in order for every request (unless a route ends the response earlier).
app.use(logger);
app.use(express.json()); // Body parser for JSON request payloads.
app.use(cookieParser()); // Parses Cookie header into req.cookies
app.use(
    session({
        secret: process.env.SESSION_SECRET || "sprinto-session-secret",
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 24 * 60 * 60,
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        },
    })
);

// Serve static client assets (SPA) from /public.
app.use(express.static(path.join(__dirname, "public")));

// Step 2-4: API routes use router-level middleware + DB-backed controllers
app.use("/api/auth", authRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/team", teamRoutes);
app.use("/", viewRoutes);

// SPA fallback: serve index.html for unknown non-API GET routes.
app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
    socket.on("joinBoard", (sprintId) => {
        if (sprintId) socket.join(`board:${sprintId}`);
    });
});

connectDatabase()
    .then(() => {
        server.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to connect to database", err);
        process.exit(1);
    });