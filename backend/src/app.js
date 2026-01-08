// backend/src/app.js
require('dotenv').config();
const express = require('express');   
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.route");
const cors = require('cors');

// Add this before your CORS middleware


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://reelbitess.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "ReelBites Backend API", 
    status: "Running",
    endpoints: {
      auth: "/api/auth",
      food: "/api/food",
      foodPartner: "/api/food-partner"
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

// ✅ FIXED: 404 handler - removed the problematic '*'
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}` 
  });
});

// ✅ FIXED: Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ 
    success: false,
    message: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

module.exports = app;