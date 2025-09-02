const BookPdf = require("../models/bookPdfModel");
const Book = require("../models/booksModel");
const path = require("path");

// Get all book PDFs (API)
exports.getAllBookPdfs = async (req, res) => {
  try {
    const pdfs = await BookPdf.findAll({ include: Book });
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book PDFs" });
  }
};

// Create a new book PDF (API)
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }
    if (!req.body.book_id) {
      return res.status(400).json({ error: "book_id is required" });
    }
    // Check if book exists
    const book = await Book.findByPk(req.body.book_id);
    if (!book) {
      return res
        .status(400)
        .json({ error: "Invalid book_id: Book does not exist" });
    }
    const pdf = await BookPdf.create({
      book_id: req.body.book_id,
      filename: req.file.originalname,
      filepath: req.file.path,
      uploaded_by: req.user.id,
    });
    res.status(201).json({ success: true, message: "PDF uploaded", pdf });
  } catch (err) {
    res.status(500).render("book-pdf-upload", {
      title: "Upload Book PDF",
      user: req.user,
      books: await Book.findAll({ where: { created_by: req.user.id } }),
      error: err.message || "Failed to upload PDF",
    });
  }
};

// Get a single book PDF (API)
exports.getBookPdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id, { include: Book });
    if (!pdf) return res.status(404).json({ error: "PDF not found" });
    res.json(pdf);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PDF" });
  }
};

// Update a book PDF (only by uploader)
exports.updateBookPdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id);
    if (!pdf) return res.status(404).json({ error: "PDF not found" });
    if (pdf.uploaded_by !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    pdf.filename = req.body.filename || pdf.filename;
    await pdf.save();

    res.json(pdf);
  } catch (err) {
    res.status(400).json({ error: "Failed to update PDF info" });
  }
};

// Delete a book PDF (only by uploader)
exports.deleteBookPdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id);
    if (!pdf) return res.status(404).json({ error: "PDF not found" });
    if (pdf.uploaded_by !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await pdf.destroy();
    res.json({ message: "PDF deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete PDF" });
  }
};

// Download endpoint for actual file download
exports.downloadBookPdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id);
    if (!pdf) return res.status(404).json({ error: "PDF not found" });
    res.download(path.resolve(pdf.filepath), pdf.filename);
  } catch (err) {
    res.status(500).json({ error: "Failed to download PDF" });
  }
};
