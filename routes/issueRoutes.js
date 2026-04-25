const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { validate } = require("../middleware/validate");
const { getAll, create, update, move, remove } = require("../controllers/issueController");

const router = express.Router();

router.get("/", requireAuth, getAll);
router.post("/", requireAuth, validate({ title: { required: true } }), create);
router.patch("/:id", requireAuth, update);
router.post("/:id/move", requireAuth, validate({ status: { required: true, type: "enum", values: ["todo", "in_progress", "done"] } }), move);
router.delete("/:id", requireAuth, remove);

module.exports = router;

