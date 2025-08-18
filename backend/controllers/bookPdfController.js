const BookPdf = require("../models/bookPdfModel");
const Book = require("../models/booksModel");
const path = require("path");

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
    res.status(201).json(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to upload PDF" });
  }
};

exports.getBookPdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id, { include: Book });
    if (!pdf) return res.status(404).json({ error: "PDF not found" });

    res.json({
      id: pdf.id,
      book_id: pdf.book_id,
      filename: pdf.filename,
      uploaded_by: pdf.uploaded_by,
      uploaded_at: pdf.uploaded_at,
      book: pdf.Book
        ? { title: pdf.Book.title, author: pdf.Book.author }
        : null,
      url: `/book-pdfs/${pdf.id}/download`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PDF" });
  }
};

// Add a download endpoint for actual file download
exports.downloadBookPdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id);
    if (!pdf) return res.status(404).json({ error: "PDF not found" });
    res.download(path.resolve(pdf.filepath), pdf.filename);
  } catch (err) {
    res.status(500).json({ error: "Failed to download PDF" });
  }
};

exports.updatePdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id);
    if (!pdf) return res.status(404).json({ error: "PDF not found" });

    const { filename } = req.body;
    await pdf.update({ filename });
    res.json(pdf);
  } catch (err) {
    res.status(400).json({ error: "Failed to update PDF info" });
  }
};

exports.deletePdf = async (req, res) => {
  try {
    const pdf = await BookPdf.findByPk(req.params.id);
    if (!pdf) return res.status(404).json({ error: "PDF not found" });

    await pdf.destroy();
    res.json({ message: "PDF deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete PDF" });
  }
};

exports.getAllBookPdfs = async (req, res) => {
  try {
    const pdfs = await BookPdf.findAll({ include: Book });
    const result = pdfs.map((pdf) => ({
      id: pdf.id,
      book_id: pdf.book_id,
      filename: pdf.filename,
      uploaded_by: pdf.uploaded_by,
      uploaded_at: pdf.uploaded_at,
      book: pdf.Book
        ? { title: pdf.Book.title, author: pdf.Book.author }
        : null,
      url: `/book-pdfs/${pdf.id}/download`,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book PDFs" });
  }
};
