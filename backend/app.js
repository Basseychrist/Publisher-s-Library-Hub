require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
const testRoutes = require("./routes/testRoutes");
const usersController = require("./controllers/usersController");
const booksController = require("./controllers/booksController");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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
    res.redirect("/success");
  }
);

// Example protected route middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// ===== 4. ROUTES =====
app.use("/users", require("./routes/usersRoute"));

// User routes
app.get("/users", ensureAuthenticated, usersController.getAllUsers);
app.get("/users/:id", ensureAuthenticated, usersController.getUserById);

// Book routes
app.get("/books", booksController.getAllBooks);
app.post("/books", ensureAuthenticated, booksController.createBook);
app.put("/books/:id", ensureAuthenticated, booksController.updateBook);
app.delete("/books/:id", ensureAuthenticated, booksController.deleteBook);

// Test routes
app.use("/test", testRoutes);

// ===== 5. SWAGGER =====
require("./swagger")(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "OK", db: !!app.locals.db });
// });


// Error handler (should be last)
app.use(errorHandler);

// Success and login routes
app.get("/success", (req, res) => res.send("Sign in successful!"));
app.get("/login", (req, res) => res.send("Login failed or required."));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };
