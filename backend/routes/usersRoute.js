const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const Book = require("../models/booksModel");
const BookPdf = require("../models/bookPdfModel");
const {
  validateUser,
  validateIdParam,
  handleValidation,
} = require("../middleware/validators");

// Optional: Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login"); // Redirect to login page if not authenticated
}

// --- Add this route BEFORE any route with /:id ---
router.get("/books", ensureAuthenticated, async (req, res) => {
  const books = await Book.findAll();
  res.render("users-books", {
    title: "All Users' Books",
    user: req.user,
    books,
  });
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user (admin/testing only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               display_name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */

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

// Update user by ID (protected)
router.put(
  "/:id",
  ensureAuthenticated,
  validateIdParam,
  validateUser, // You may want a separate validator for update
  handleValidation,
  usersController.updateUser
);

// Delete user by ID (protected)
router.delete(
  "/:id",
  ensureAuthenticated,
  validateIdParam,
  handleValidation,
  usersController.deleteUser
);

module.exports = router;
