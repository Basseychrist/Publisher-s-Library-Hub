const Book = require("../models/booksModel");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    await Book.create({
      title,
      author,
      description,
      created_by: req.user.id, // Use created_by if that's your user column
    });
    res.status(201).json({ success: true, message: "Book created" });
  } catch (err) {
    res.status(400).json({ error: "Failed to create book" });
  }
};

// Update a book (only by creator)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.created_by !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const { title, author, description } = req.body;
    await book.update({ title, author, description });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: "Failed to update book" });
  }
};

// Delete a book (only by creator)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.created_by !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await book.destroy();
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete book" });
  }
};
