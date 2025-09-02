const express = require("express");
const router = express.Router();
const bookPdfController = require("../controllers/bookPdfController");

/**
 * @swagger
 * tags:
 *   name: BookPDFs
 *   description: API endpoints for book PDFs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookPdf:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         filename:
 *           type: string
 *         uploaded_by:
 *           type: integer
 *         uploaded_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/book-pdfs:
 *   get:
 *     summary: Get all book PDFs
 *     tags: [BookPDFs]
 *     responses:
 *       200:
 *         description: List of book PDFs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookPdf'
 *   post:
 *     summary: Upload a PDF for a book
 *     tags: [BookPDFs]
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
 * /api/book-pdfs/{id}:
 *   get:
 *     summary: Get metadata for a book PDF by ID
 *     tags: [BookPDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book PDF metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookPdf'
 *   put:
 *     summary: Update PDF info (not file content)
 *     tags: [BookPDFs]
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
 *         description: PDF info updated
 *   delete:
 *     summary: Delete a PDF file
 *     tags: [BookPDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF deleted
 */

// API endpoints
router.get("/", bookPdfController.getAllBookPdfs);
// router.post("/", bookPdfController.uploadPdf); // For API uploads only
router.get("/:id", bookPdfController.getBookPdf);
router.put("/:id", bookPdfController.updateBookPdf);
router.delete("/:id", bookPdfController.deleteBookPdf);

module.exports = router;
