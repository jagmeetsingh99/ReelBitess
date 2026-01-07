// backend/src/controllers/auth.controller.js
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ FIXED: Add fallback for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_key_change_in_production';

// Register User
async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}

// Login User - ✅ FIXED with proper error handling
async function loginUser(req, res) {
  try {
    console.log("🔍 Login attempt received");
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Other functions remain the same with JWT_SECRET fallback...
function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;

    if (!name || !email || !password || !phone || !address || !contactName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAccountAlreadyExist = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "Food Partner account already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName
    });

    const token = jwt.sign({ id: foodPartner._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: "Food Partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name
      }
    });
  } catch (error) {
    console.error("Register Food Partner error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const token = jwt.sign({ id: foodPartner._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name
      }
    });
  } catch (error) {
    console.error("Food Partner login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function logoutfoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}

module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser, 
  registerFoodPartner, 
  loginFoodPartner, 
  logoutfoodPartner 
};