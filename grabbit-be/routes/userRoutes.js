const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, password });
    await user.save();

    const payload = {
      user: { id: user._id, email: user.email, role: user.role },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
          token,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/users/login
// @desc Authenticate a user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const payload = {
      user: { id: user._id, email: user.email, role: user.role },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
          token,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/users/profile
// @desc Get user profile data
// @access Private
router.get("/profile", protect, (req, res) => {
  res.status(201).json(req.user);
});

module.exports = router;
