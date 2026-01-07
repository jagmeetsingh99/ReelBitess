// backend/server.js
require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// ✅ FIXED: Better MongoDB connection with multiple URI options
const connectDB = async () => {
  try {
    // Try multiple environment variable names
    const mongoURI = process.env.MONGO_DB_URI || process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MongoDB URI not found in environment variables.');
      console.error('Please set MONGO_DB_URI in your .env file:');
      console.error('MONGO_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname');
      process.exit(1);
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
    });
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Please check your MongoDB connection string and network.');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ API available at: http://localhost:${PORT}`);
      console.log(`✅ Test route: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start the application
startServer();