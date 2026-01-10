const foodpartnerModel = require("../models/foodpartner.model");
const  userModel = require("../models/user.model")
const jwt =require("jsonwebtoken");

// backend/src/middlewares/auth.middleware.js
async function authFoodPartnerMiddleware(req, res, next) {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to cookie (for backward compatibility)
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Authentication required. Please login first."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development_secret_key_change_in_production');
    const foodPartner = await foodpartnerModel.findById(decoded.id);
    
    if (!foodPartner) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    
    req.foodPartner = foodPartner;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

// Do the same for authUserMiddleware (copy the same pattern)
async function authUserMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Authentication required. Please login first."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development_secret_key_change_in_production');
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}
module.exports = {
    authFoodPartnerMiddleware, authUserMiddleware
}