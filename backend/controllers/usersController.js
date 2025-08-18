const User = require("../models/usersModel");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [user] = await User.findOrCreate({
          where: { google_id: profile.id },
          defaults: {
            display_name: profile.displayName,
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
          },
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { google_id, display_name, email, first_name, last_name } = req.body;
    const user = await User.create({
      google_id,
      display_name,
      email,
      first_name,
      last_name,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Failed to create user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { display_name, first_name, last_name } = req.body;
    await user.update({ display_name, first_name, last_name });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete user" });
  }
};
