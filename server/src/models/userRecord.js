const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
      role: {
    type: String,
    enum: ["CREATOR", "APPROVER"],
    required: true
  }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
