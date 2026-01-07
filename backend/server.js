// backend/server.js
require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    // Try multiple environment variable names
    const mongoURI = process.env.MONGO_DB_URI;
    
    if (!mongoURI) {
      console.error('❌ MongoDB URI not found in environment variables.');
      console.error('Please set MONGO_DB_URI in Render dashboard → Environment');
      process.exit(1);
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    
    // Remove deprecated options for newer mongoose
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('\n🔍 Troubleshooting steps:');
    console.error('1. Check MongoDB Atlas IP Whitelist: https://cloud.mongodb.com/');
    console.error('2. Add 0.0.0.0/0 to allow all IPs');
    console.error('3. Verify connection string has database name');
    console.error('4. Check username/password in connection string');
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ API available at: https://reelbitess.onrender.com`);
      console.log(`✅ MongoDB Connected: ${mongoose.connection.readyState === 1 ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();