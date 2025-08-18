const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const {
  validateUser,
  validateIdParam,
  handleValidation,
} = require("../middleware/validators");

// Optional: Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Get all users (protected)
router.get("/", ensureAuthenticated, usersController.getAllUsers);

// Create a new user (for admin/testing, not for Google OAuth)
router.post("/", validateUser, handleValidation, usersController.createUser);

// Get user by ID (with ID validation)
router.get(
  "/:id",
  ensureAuthenticated,
  validateIdParam,
  handleValidation,
  usersController.getUserById
);

module.exports = router;
