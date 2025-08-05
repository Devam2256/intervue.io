// Import the User model
const User = require("../models/User");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Find all users (excluding sensitive information)
    const users = await User.find().select('-email -phone -resume');
    
    // Send success response with users data
    res.status(200).json(users);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);
    
    // If user not found, send 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Send success response with user data
    res.status(200).json(user);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.params.email });
    
    // If user not found, send 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Send success response with user data
    res.status(200).json(user);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Log the incoming user data for debugging
    console.log('Creating user:', req.body);
    
    // Create new user with data from request body
    const user = new User(req.body);
    
    // Save the user to database
    await user.save();
    
    // Send success response with created user data
    res.status(201).json(user);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    // Find and update user by ID
    // req.body contains the new data
    // { new: true } returns the updated document
    // { runValidators: true } runs validation on the update
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // If user not found, send 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Send success response with updated user data
    res.status(200).json(user);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(req.params.id);
    
    // If user not found, send 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Send success response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get user profile (public information)
exports.getUserProfile = async (req, res) => {
  try {
    // Find user by ID and select only public fields
    const user = await User.findById(req.params.id).select(
      'firstName lastName fullName headline bio experience skills education workExperience portfolio socialMedia preferredCategories preferredJobTypes preferredLocations avatar location'
    );
    
    // If user not found, send 404 error
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }
    
    // Send success response with user profile data
    res.status(200).json(user);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    // Find and update user by ID
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // If user not found, send 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Send success response with updated user data
    res.status(200).json(user);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Get users by skills (for job matching)
exports.getUsersBySkills = async (req, res) => {
  try {
    const { skills } = req.query;
    
    // Convert skills string to array if it's a string
    const skillsArray = typeof skills === 'string' ? skills.split(',') : skills;
    
    // Find users who have any of the specified skills
    const users = await User.find({
      skills: { $in: skillsArray }
    }).select('firstName lastName fullName headline skills experience location avatar');
    
    // Send success response with users data
    res.status(200).json(users);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get users by location
exports.getUsersByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    
    // Find users by location (case-insensitive)
    const users = await User.find({
      location: { $regex: location, $options: 'i' }
    }).select('firstName lastName fullName headline skills experience location avatar');
    
    // Send success response with users data
    res.status(200).json(users);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get users by employment status
    const usersByStatus = await User.aggregate([
      {
        $group: {
          _id: '$employmentStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get users by location
    const usersByLocation = await User.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Get most common skills
    const commonSkills = await User.aggregate([
      {
        $unwind: '$skills'
      },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Send success response with statistics
    res.status(200).json({
      totalUsers,
      usersByStatus,
      usersByLocation,
      commonSkills
    });
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};