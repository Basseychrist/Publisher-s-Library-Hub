const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const {
  validateBook,
  validateIdParam,
  handleValidation,
} = require("../middleware/validators");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 *
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
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
 *         description: Book deleted
 */

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
