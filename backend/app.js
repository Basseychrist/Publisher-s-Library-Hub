require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const testRoutes = require("./routes/testRoutes");
const usersController = require("./controllers/usersController");
const booksController = require("./controllers/booksController");
const errorHandler = require("./middleware/errorHandler");
const Book = require("./models/booksModel");
const BookPdf = require("./models/bookPdfModel");

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user
const User = require("./models/usersModel");
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Example protected route middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login"); // Redirect to login page if not authenticated
}

// ===== 4. ROUTES =====
app.use("/users", require("./routes/usersRoute"));

// User routes
app.get("/users", ensureAuthenticated, usersController.getAllUsers);
app.get("/users/:id", ensureAuthenticated, usersController.getUserById);

// Test routes
app.use("/test", testRoutes);

// Place these BEFORE app.use("/book-pdfs", ...)
app.get("/book-pdfs", ensureAuthenticated, async (req, res) => {
  const bookPdfs = await BookPdf.findAll({
    where: { uploaded_by: req.user.id }
  });
  res.render("book-pdf", {
    title: "Your Book PDFs",
    user: req.user,
    bookPdfs,
  });
});

// Show upload form (EJS view)
app.get("/book-pdfs/upload", ensureAuthenticated, async (req, res) => {
  try {
    const pdfs = await BookPdf.findAll({ where: { uploaded_by: req.user.id } });
    res.render("book-pdf-upload", {
      title: "Upload Book PDF",
      user: req.user,
      pdfs, // <-- Pass pdfs to EJS
      error: null,
    });
  } catch (err) {
    res.status(500).render("book-pdf-upload", {
      title: "Upload Book PDF",
      user: req.user,
      pdfs: [], // <-- Always pass pdfs
      error: err.message || "Failed to load upload form",
    });
  }
});

// Handle PDF upload (EJS form POST)
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
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

app.post(
  "/book-pdfs/upload",
  ensureAuthenticated,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).render("book-pdf-upload", {
          title: "Upload Book PDF",
          user: req.user,
          error: "No PDF file uploaded",
        });
      }
      // Accept book_id if provided, otherwise set to null
      await BookPdf.create({
        book_id: req.body.book_id || null,
        filename: req.file.originalname,
        filepath: req.file.path,
        uploaded_by: req.user.id,
      });
      res.redirect("/book-pdfs");
    } catch (err) {
      res.status(500).render("book-pdf-upload", {
        title: "Upload Book PDF",
        user: req.user,
        error: err.message || "Failed to upload PDF",
      });
    }
  }
);

// Now register your router
app.use("/book-pdfs", require("./routes/bookPdfRoute"));

// Download PDF
app.get("/book-pdfs/:id/download", ensureAuthenticated, async (req, res) => {
  const pdf = await BookPdf.findByPk(req.params.id);
  if (!pdf) return res.status(404).send("PDF not found");
  res.download(pdf.filepath, pdf.filename); // This sends the file for download
});

// Show update form
app.get("/book-pdfs/:id/edit", ensureAuthenticated, async (req, res) => {
  const pdf = await BookPdf.findByPk(req.params.id);
  if (!pdf) return res.status(404).send("PDF not found");
  res.render("book-pdf-edit", {
    title: "Edit Book PDF", // <-- Add this line
    pdf,
    user: req.user,
  });
});

// Handle update
app.post("/book-pdfs/:id/edit", ensureAuthenticated, async (req, res) => {
  await BookPdf.update(
    {
      book_id: req.body.book_id || null,
      book_title: req.body.book_title || null,
      filename: req.body.filename || null,
    },
    { where: { id: req.params.id } }
  );
  res.redirect("/book-pdfs");
});

// Delete PDF
app.get("/book-pdfs/:id/delete", ensureAuthenticated, async (req, res) => {
  await BookPdf.destroy({ where: { id: req.params.id } });
  res.redirect("/book-pdfs");
});

// ===== 5. SWAGGER =====
const setupSwagger = require("./swagger");
setupSwagger(app);

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(__dirname + "public/css"));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layout"); // Default layout file: views/layout.ejs

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

// Dashboard route
app.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const books = await Book.findAll({ where: { created_by: req.user.id } });
  const bookPdfs = await BookPdf.findAll({
    where: { uploaded_by: req.user.id },
  });
  res.render("dashboard", {
    title: "Dashboard",
    user: req.user,
    books,
    bookPdfs,
  });
});

// List all books for the logged-in user (EJS view)
app.get("/books", ensureAuthenticated, async (req, res) => {
  const books = await Book.findAll({ where: { created_by: req.user.id } });
  res.render("books", { title: "Your Books", user: req.user, books });
});

// Show form to create a new book (EJS view)
app.get("/books/new", ensureAuthenticated, (req, res) => {
  res.render("book-new", {
    title: "Create New Book",
    user: req.user,
    error: null, // Always pass error
  });
});

// Handle book creation from form (EJS view)
app.post("/books", ensureAuthenticated, async (req, res) => {
  try {
    await Book.create({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      //user_id: req.user.id, // or
      created_by: req.user.id, //if your model uses created_by
    });
    res.redirect("/books");
  } catch (err) {
    res.status(400).render("book-new", {
      title: "Create New Book",
      user: req.user,
      error: "Failed to create book",
    });
  }
});

// Show form to edit a book (EJS view)
app.get("/books/:id/edit", ensureAuthenticated, async (req, res) => {
  const book = await Book.findOne({
    where: { id: req.params.id, created_by: req.user.id },
  });
  if (!book) return res.status(404).send("Book not found");
  res.render("book-edit", {
    title: "Edit Book",
    user: req.user,
    book,
  });
});

// Handle book update from form (EJS view)
app.post("/books/:id/edit", ensureAuthenticated, async (req, res) => {
  try {
    await Book.update(
      {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
      },
      { where: { id: req.params.id, created_by: req.user.id } }
    );
    res.redirect("/books");
  } catch (err) {
    res.status(400).send("Failed to update book");
  }
});

// Handle book deletion (EJS view)
app.get("/books/:id/delete", ensureAuthenticated, async (req, res) => {
  await Book.destroy({ where: { id: req.params.id, created_by: req.user.id } });
  res.redirect("/books");
});

// Place this FIRST
app.get("/users/books", ensureAuthenticated, async (req, res) => {
  const bookPdfs = await BookPdf.findAll(); // Make sure BookPdf is required at the top
  res.render("users-books", {
    title: "All Users' PDF Books",
    user: req.user,
    bookPdfs,
  });
});

// Place this BELOW
app.get("/users/:id/books", ensureAuthenticated, async (req, res) => {
  const books = await Book.findAll({
    where: { user_id: req.params.id }
  });
  res.render("user-books", {
    title: "User's Books",
    user: req.user,
    books,
  });
});

// Show all books (EJS view)
app.get("/all-books", ensureAuthenticated, async (req, res) => {
  const books = await Book.findAll();
  res.render("all-books", {
    title: "All Users' Books",
    user: req.user,
    books,
  });
});

// ===== API ROUTES FOR SWAGGER =====

app.use("/api/books", require("./routes/booksApiRoute"));
app.use("/api/book-pdfs", require("./routes/bookPdfsApiRoute")); // Similarly for book-pdfs, etc.

// Error handler (should be last)
app.use(errorHandler);

// Success and login routes
app.get("/success", (req, res) => res.send("Sign in successful!"));
app.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = app;
