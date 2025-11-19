const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Profile = require("./models/Profile");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://srimathi:1234@cluster0.vzrebun.mongodb.net/auth_profile_app";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("API running");
});

// Get profile by firebaseUid
app.get("/api/profile/:firebaseUid", async (req, res) => {
  console.log("GET /api/profile/", req.params.firebaseUid);
  try {
    const profile = await Profile.findOne({
      firebaseUid: req.params.firebaseUid,
    });
    if (!profile) return res.status(404).json({ message: "Not found" });
    res.json(profile);
  } catch (err) {
    console.error("GET profile error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Create profile

app.post("/api/profile", async (req, res) => {
  console.log("POST /api/profile", req.body);
  try {
    const profile = await Profile.create(req.body);
    
    res.status(201).json(profile);
  } catch (err) {
    console.error("POST profile error:", err);
    res.status(400).json({ message: err.message });
  }
});


// Update profile
app.put("/api/profile/:id", async (req, res) => {
  console.log("PUT /api/profile/", req.params.id, req.body);
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("PUT profile error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Delete profile
app.delete("/api/profile/:id", async (req, res) => {
  console.log("DELETE /api/profile/", req.params.id);
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("DELETE profile error:", err);
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
