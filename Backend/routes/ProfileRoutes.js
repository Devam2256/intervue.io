const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
// Remove this line
// const UserProfile = require('../models/UserProfile');
const { requireAuth, requireUserType } = require('../middleware/session');
const { sendEmail } = require('../config/email');

// Get profile setup status
router.get('/setup-status', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const userType = req.session.userType;

    let profileExists = false;
    let profileData = null;

    if (userType === 'company') {
      const company = await Company.findOne({ userId });
      profileExists = !!company;
      profileData = company;
    } else {
      // Change this to use User model instead of UserProfile
      const userProfile = await User.findById(userId);
      profileExists = !!userProfile;
      profileData = userProfile;
    }

    res.json({
      profileExists,
      isComplete: profileData?.isProfileComplete || false,
      userType
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile setup status' });
  }
});

// Setup company profile
router.post('/setup/company', requireUserType('company'), async (req, res) => {
  try {
    const userId = req.session.userId;
    const {
      companyName,
      industry,
      description,
      location,
      companySize,
      website,
      phone,
      socialLinks,
      benefits,
      logo,
      password // New field
    } = req.body;

    // Validation
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Update user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = password;
    await user.save();

    // Parse companySize to a number if possible
    let parsedCompanySize;
    if (companySize) {
      // Extract the first number from the string (e.g., "1-10" becomes 1)
      const match = companySize.match(/\d+/);
      parsedCompanySize = match ? parseInt(match[0], 10) : undefined;
    }

    // Check if company profile already exists
    let company = await Company.findOne({ userId });
    
    if (company) {
      // Update existing profile
      Object.assign(company, {
        name: companyName, // Map companyName to name
        industry,
        description,
        location,
        companySize: parsedCompanySize, // Use the parsed value
        website,
        phone,
        email: user.email, // Add email from user
        socialMedia: socialLinks, // Map socialLinks to socialMedia
        benefits,
        logo,
        isProfileComplete: true
      });
    } else {
      // Create new profile
      company = new Company({
        userId,
        name: companyName, // Map companyName to name
        industry,
        description,
        location,
        companySize: parsedCompanySize, // Use the parsed value
        website,
        phone,
        email: user.email, // Add email from user
        socialMedia: socialLinks, // Map socialLinks to socialMedia
        benefits,
        logo,
        isProfileComplete: true
      });
    }

    await company.save();

    // Send welcome email after profile completion
    await sendEmail(user.email, 'welcomeEmail', user.userType, company.name);

    res.json({
      message: 'Company profile setup successful',
      profile: company
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to setup company profile' });
  }
});

// Setup user profile
router.post('/setup/user', requireUserType('user'), async (req, res) => {
  try {
    console.log('Profile setup route called');
    const userId = req.session.userId;
    console.log('Session data:', { userId, email: req.session.email, userType: req.session.userType });
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const {
      firstName,
      lastName,
      phone,
      location,
      headline,
      bio,
      experience,
      employmentStatus,
      skills,
      education,
      workExperience,
      portfolio,
      expectedSalary,
      password // New field
    } = req.body;

    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Update user with password and profile information
    console.log('Looking for user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Found user:', user.email, 'isEmailVerified:', user.isEmailVerified);

    // Update user with all profile fields
    const updateData = {
      password,
      firstName,
      lastName,
      phone,
      location,
      headline,
      bio,
      experience,
      employmentStatus,
      skills,
      education,
      workExperience, // Note: this matches the field name in User model
      socialMedia: portfolio, // Map portfolio to socialMedia field in User model
      expectedSalary,
      isProfileComplete: true
    };
    
    console.log('Updating user with data:', JSON.stringify(updateData, null, 2));
    
    Object.assign(user, updateData);

    console.log('About to save user...');
    await user.save();
    console.log('User saved successfully');

    // Send welcome email after profile completion
    await sendEmail(user.email, 'welcomeEmail', user.userType, `${user.firstName} ${user.lastName}`);

    res.json({
      message: 'User profile setup successful',
      profile: user
    });

  } catch (error) {
    console.error('User profile setup error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: `Validation error: ${validationErrors.join(', ')}` });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to setup user profile' });
  }
});

// Get company profile
router.get('/company', requireUserType('company'), async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const company = await Company.findOne({ userId });

    if (!company) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    res.json({ profile: company });

  } catch (error) {
    res.status(500).json({ error: 'Failed to get company profile' });
  }
});

// Get user profile
router.get('/user', requireUserType('user'), async (req, res) => {
  try {
    const userId = req.session.userId;
    // Change this to use User model instead of UserProfile
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({ profile: userProfile });

  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update company profile
router.put('/company', requireUserType('company'), async (req, res) => {
  try {
    const userId = req.session.userId;
    const updateData = req.body;

    const company = await Company.findOne({ userId });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    // Validate required fields
    if (!updateData.name) {
      return res.status(400).json({ error: 'Company name is required' });
    }
    if (!updateData.industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }
    if (!updateData.description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!updateData.location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    Object.assign(company, updateData);
    await company.save();

    res.json({
      message: 'Company profile updated successfully',
      profile: company
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to update company profile' });
  }
});

// Update user profile
router.put('/user', requireUserType('user'), async (req, res) => {
  try {
    const userId = req.session.userId;
    const updateData = req.body;

    // Change this to use User model instead of UserProfile
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    Object.assign(userProfile, updateData);
    await userProfile.save();

    res.json({
      message: 'User profile updated successfully',
      profile: userProfile
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

module.exports = router;