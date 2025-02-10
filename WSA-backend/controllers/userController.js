const User = require("../models/User");

exports.registerUser = async (req, res) => {
  const { name, phone } = req.body;
  try {
    const user = new User({ name, phone });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addEmergencyContacts = async (req, res) => {
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
};

exports.updateLocation = async (req, res) => {
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
};
