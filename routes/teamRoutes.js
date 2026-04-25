const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { validate } = require("../middleware/validate");
const { get, add, update, analytics } = require("../controllers/teamController");

const router = express.Router();

router.get("/", requireAuth, get);
router.get("/analytics", requireAuth, analytics);
router.post("/", requireAuth, validate({ name: { required: true } }), add);
router.patch("/:id", requireAuth, update);

module.exports = router;

