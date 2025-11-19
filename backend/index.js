const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Profile = require("./models/Profile");

dotenv.config();

const app = express();

// CORS 
app.use(
  cors({
    origin: "*", 
  })
);

app.use(express.json());


const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

app.get("/", (req, res) => {
  res.send("API running successfully 🎉");
});

// Get profile
app.get("/api/profile/:firebaseUid", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      firebaseUid: req.params.firebaseUid,
    });

    if (!profile) return res.status(404).json({ message: "Not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create profile
app.post("/api/profile", async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update profile
app.put("/api/profile/:id", async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete profile
app.delete("/api/profile/:id", async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
