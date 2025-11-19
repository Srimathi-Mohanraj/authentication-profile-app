const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
