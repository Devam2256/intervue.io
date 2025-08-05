// Import required packages
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Define API routes for users (job seekers)

// GET /api/users - Get all users (public information only)
router.get("/users", UserController.getUsers);

// GET /api/users/stats - Get user statistics
router.get("/users/stats", UserController.getUserStats);

// GET /api/users/skills - Get users by skills
router.get("/users/skills", UserController.getUsersBySkills);

// GET /api/users/location/:location - Get users by location
router.get("/users/location/:location", UserController.getUsersByLocation);

// GET /api/users/email/:email - Get user by email
router.get("/users/email/:email", UserController.getUserByEmail);

// GET /api/users/:id - Get a single user by ID
router.get("/users/:id", UserController.getUserById);

// GET /api/users/:id/profile - Get user profile (public information)
router.get("/users/:id/profile", UserController.getUserProfile);

// POST /api/users - Create a new user
router.post("/users", UserController.createUser);

// PUT /api/users/:id - Update an existing user
router.put("/users/:id", UserController.updateUser);

// PUT /api/users/:id/profile - Update user profile
router.put("/users/:id/profile", UserController.updateUserProfile);

// DELETE /api/users/:id - Delete a user
router.delete("/users/:id", UserController.deleteUser);

// Export the router to be used in the main app
module.exports = router; 