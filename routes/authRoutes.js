/**
 * Auth routes module
 *
 * Routing concept:
 * - Separate routes into modules by feature area.
 * - Keep request validation + persistence logic in controllers.
 */

const express = require("express");
const { signup, login, logout, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.post("/signup", validate({ email: { required: true, type: "email" }, password: { required: true, minLength: 6 }, name: { required: true } }), signup);
router.post("/login", validate({ email: { required: true, type: "email" }, password: { required: true, minLength: 6 } }), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

module.exports = router;

