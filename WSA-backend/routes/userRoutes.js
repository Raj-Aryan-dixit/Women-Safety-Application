const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { name, phone } = req.body;
  try {
    const user = new User({ name, phone });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add emergency contacts
router.post("/:id/contacts", async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  try {
    const user = await User.findById(id);
    user.emergencyContacts.push({ name, phone });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user location
router.post("/:id/location", async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;
  try {
    const user = await User.findById(id);
    user.location.coordinates = [longitude, latitude];
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
