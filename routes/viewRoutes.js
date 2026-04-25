const express = require("express");

const { renderLogin, renderDashboard, renderSprint } = require("../controllers/viewController");
const { requireViewAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/login", renderLogin);
router.get("/dashboard", requireViewAuth, renderDashboard);
router.get("/sprints/:id", requireViewAuth, renderSprint);

module.exports = router;
