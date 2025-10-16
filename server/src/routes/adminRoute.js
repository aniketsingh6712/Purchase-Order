const express = require("express");
const router = express.Router();
const User = require("../models/userRecord");
const { authenticateToken, roleCheck } = require("../middleware/auth");
//  Get all users (Admin only)
router.get("/",authenticateToken,roleCheck("ADMIN"), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "ADMIN" } }).select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

//  Update user role
router.put("/:id/role", authenticateToken,roleCheck("ADMIN"),async (req, res) => {
  try {
    const { role } = req.body;

    if (!["CREATOR", "APPROVER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
});

//Delete user

router.delete("/:id", authenticateToken, roleCheck("ADMIN"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user.role === "ADMIN") {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});

module.exports = router;
