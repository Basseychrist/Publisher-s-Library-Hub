const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const {
  validateBook,
  validateIdParam,
  handleValidation,
} = require("../middleware/validators");

// Optional: Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Get all books (public)
router.get("/", booksController.getAllBooks);

// Create a new book (protected)
router.post(
  "/",
  ensureAuthenticated,
  validateBook,
  handleValidation,
  booksController.createBook
);

// Update a book (protected)
router.put(
  "/:id",
  ensureAuthenticated,
  validateIdParam,
  validateBook,
  handleValidation,
  booksController.updateBook
);

// Delete a book (protected)
router.delete("/:id", ensureAuthenticated, booksController.deleteBook);

module.exports = router;
