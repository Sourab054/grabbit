const express = require("express");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

// @route POST /api/subscribe
// @desc Subscribe user to the newsletter
// @access Public
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });
    if (subscriber)
      return res.status(400).json({ message: "You are already subscribed" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "You have successfully subscribed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
