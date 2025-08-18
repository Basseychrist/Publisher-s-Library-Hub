const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bookPdfController = require("../controllers/bookPdfController");
const ensureAuthenticated = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

/**
 * @swagger
 * tags:
 *   name: BookPDFs
 *   description: Book PDF management
 *
 * /book-pdfs:
 *   get:
 *     summary: Get all book PDFs
 *     tags: [BookPDFs]
 *     responses:
 *       200:
 *         description: List of book PDFs
 *   post:
 *     summary: Upload a PDF for a book
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
 *     summary: Download a book PDF by ID
 *     tags: [BookPDFs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file
 *   put:
 *     summary: Update PDF file info (not file content)
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
 *         description: PDF info updated
 *   delete:
 *     summary: Delete a PDF file
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
 *         description: PDF deleted
 */

router.post(
  "/",
  ensureAuthenticated,
  upload.single("file"),
  bookPdfController.uploadPdf
);
router.get("/:id", bookPdfController.getBookPdf); // Returns metadata and download URL
router.get("/:id/download", bookPdfController.downloadBookPdf); // Returns the actual PDF file
router.put("/:id", ensureAuthenticated, bookPdfController.updatePdf);
router.delete("/:id", ensureAuthenticated, bookPdfController.deletePdf);
router.get("/", bookPdfController.getAllBookPdfs);

module.exports = router;
