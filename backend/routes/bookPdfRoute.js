const express = require("express");
const router = express.Router();
const bookPdfController = require("../controllers/bookPdfController");
const ensureAuthenticated = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: BookPDFs
 *   description: Book PDF management
 */

/**
 * @swagger
 * /book-pdfs:
 *   get:
 *     summary: Get all book PDFs
 *     tags: [BookPDFs]
 *     responses:
 *       200:
 *         description: List of book PDFs
 *   post:
 *     summary: Upload a new book PDF
 *     tags: [BookPDFs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: PDF uploaded
 *
 * /book-pdfs/{id}:
 *   get:
 *     summary: Get a book PDF by ID
 *     tags: [BookPDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book PDF found
 *   put:
 *     summary: Update a book PDF
 *     tags: [BookPDFs]
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
 *               filename:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book PDF updated
 *   delete:
 *     summary: Delete a book PDF
 *     tags: [BookPDFs]
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
 *         description: Book PDF deleted
 */

// Do NOT add any /book-pdfs/upload route here

// Other API endpoints (if needed)
router.get("/:id", bookPdfController.getBookPdf);
router.put("/:id", ensureAuthenticated, bookPdfController.updateBookPdf);
router.delete("/:id", ensureAuthenticated, bookPdfController.deleteBookPdf);
router.get(
  "/:id/download",
  ensureAuthenticated,
  bookPdfController.downloadBookPdf
);

module.exports = router;
