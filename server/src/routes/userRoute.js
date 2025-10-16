const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userRecord"); 
const { authenticateToken } = require("../middleware/auth");

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "CREATOR", 
    });

    await newUser.save();

    res.status(200).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
   
    const { email, password } = req.body;
   
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    
  // const accessToken = jwt.sign(
  //   { userId: user._id, email: user.email, role: user.role },
  //   process.env.ACCESS_TOKEN_SECRET,
  //   { expiresIn: "2m" } 
  // );
    
  // const refreshToken = jwt.sign(
  //   { userId: user._id, email: user.email, role: user.role },
  //   process.env.REFRESH_TOKEN_SECRET,
  //   { expiresIn: "7d" } 
  // );

  // // Store tokens in secure httpOnly cookies
  // res.cookie("accessToken", accessToken, {
    
  //   maxAge: 15 * 60 * 1000, // 1 minutes
  // });

  // res.cookie("refreshToken", refreshToken, {
   
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });

  

    res.status(200).json({
      message: "Login successful",
      token,
      role:user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//for role
router.get("/role", authenticateToken, async (req, res) => {
  try {
    
  
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "None", secure: true });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
