const { body, param, validationResult } = require("express-validator");

// Book validators
const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("description").optional().isString(),
];

// User validators (for admin/testing endpoints)
const validateUser = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("display_name").notEmpty().withMessage("Display name is required"),
  body("first_name").optional().isString(),
  body("last_name").optional().isString(),
];

// ID param validator
const validateIdParam = [
  param("id").isInt().withMessage("ID must be an integer"),
];

// Middleware to handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateBook,
  validateUser,
  validateIdParam,
  handleValidation,
};
