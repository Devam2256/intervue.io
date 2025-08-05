// Import required packages
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // Get MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Exit process if database connection fails
    process.exit(1);
  }
}

// Export the function so it can be used in other files
module.exports = connectDB;