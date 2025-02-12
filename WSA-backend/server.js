const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const multer = require("multer");
const path = require("path");
const User = require("./models/User"); // Import User model

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to Upload Profile Picture & Save in Database
app.post(
  "/api/auth/upload-profile-picture/:userId",
  upload.single("profilePic"),
  async (req, res) => {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Update the user's profilePicture field in MongoDB
      const imageUrl = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: imageUrl },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ imageUrl, message: "Profile picture updated successfully" });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Error saving profile picture" });
    }
  }
);

// Routes
app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
