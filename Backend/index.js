// Import required packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { initializeSession } = require("./middleware/session");

// Create Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Set port (use 3000 if not specified in .env)
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Initialize session middleware
initializeSession(app);

// Middleware - Parse JSON requests
app.use(express.json());

// Connect to MongoDB database
connectDB();

// Simple home route
app.get('/', (req, res) => {
    res.send("Welcome to InterVue API - Job Portal Backend");
});

// Import and use routes
const authRoutes = require("./routes/AuthRoutes");
const profileRoutes = require("./routes/ProfileRoutes");
const companyRoutes = require("./routes/CompanyRoutes");
const jobRoutes = require("./routes/JobRoutes");
const candidateRoutes = require("./routes/CandidateRoutes");
const userRoutes = require("./routes/UserRoutes");

// Mount routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", companyRoutes);
app.use("/api", jobRoutes);
app.use("/api", candidateRoutes);
app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});