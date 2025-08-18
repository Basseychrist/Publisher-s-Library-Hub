const express = require("express");
const router = express.Router();

// Public test route
router.get("/public", (req, res) => {
  res.json({ message: "Public route is working!" });
});

// Protected test route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

router.get("/protected", ensureAuthenticated, (req, res) => {
  res.json({ message: "Protected route is working!", user: req.user });
});

module.exports = router;
