const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
// Remove this line as we'll use User model directly
// const UserProfile = require('../models/UserProfile');
const { sendEmail } = require('../config/email');
const { generateToken, authLimiter, otpLimiter } = require('../middleware/auth');
const { setUserSession, clearUserSession, requireAuth } = require('../middleware/session');

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, userType } = req.body;

    // Validation
    if (!email || !userType) {
      return res.status(400).json({ error: 'Email and user type are required' });
    }

    if (!['company', 'user'].includes(userType)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user (without password)
    const userData = {
      email,
      userType,
      // No password at this stage
    };

    const user = new User(userData);
    await user.save();

    // Generate and send OTP
    const otp = user.generateOTP();
    await user.save();

    const emailSent = await sendEmail(email, 'otpVerification', otp, userType);
    
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify OTP
router.post('/verify-otp', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark email as verified immediately
    user.isEmailVerified = true;
    user.clearOTP();
    await user.save();

    // Set session
    setUserSession(req, user);

    res.json({
      message: 'Email verified successfully. Please complete your profile.',
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName
      },
      requiresProfileSetup: true
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Add a new route for setting password after OTP verification
// router.post('/set-initial-password', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ error: 'Password must be at least 6 characters long' });
//     }

//     const user = await User.findOne({
//       email,
//       resetPasswordToken: 'otp-verified',
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid or expired verification. Please try again.' });
//     }

//     // Set password and mark email as verified
//     user.password = password;
//     user.isEmailVerified = true;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     // Set session
//     setUserSession(req, user);

//     res.json({
//       message: 'Password set successfully',
//       user: {
//         id: user._id,
//         email: user.email,
//         userType: user.userType,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         companyName: user.companyName
//       },
//       requiresProfileSetup: true
//     });

//   } catch (error) {
//     console.error('Set password error:', error);
//     res.status(500).json({ error: 'Failed to set password' });
//   }
// });

// Resend OTP
router.post('/resend-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    const emailSent = await sendEmail(email, 'otpVerification', otp, user.userType);
    
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set session
    setUserSession(req, user);

    // Check if profile is complete
    let requiresProfileSetup = false;
    if (user.userType === 'company') {
      const company = await Company.findOne({ userId: user._id });
      requiresProfileSetup = !company || !company.isProfileComplete;
    } else {
      // Replace UserProfile check with User model check
      requiresProfileSetup = !user.isProfileComplete;
    }
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName
      },
      requiresProfileSetup
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  clearUserSession(req);
  res.json({ message: 'Logged out successfully' });
});

// Check session status
router.get('/session', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.json({
      isAuthenticated: true,
      user: {
        _id: req.session.userId,
        id: req.session.userId, // Keep both for compatibility
        email: req.session.email,
        userType: req.session.userType
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});





// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    
    if (!user) {
      clearUserSession(req);
      return res.status(401).json({ error: 'Invalid session' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Add these routes after the existing forgot-password and reset-password routes

// Forgot password with OTP
router.post('/forgot-password-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate and send OTP
    const otp = user.generateOTP();
    await user.save();

    const emailSent = await sendEmail(email, 'passwordResetOTP', otp);
    
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({ message: 'Password reset OTP sent successfully' });

  } catch (error) {
    console.error('Forgot password OTP error:', error);
    res.status(500).json({ error: 'Failed to process password reset' });
  }
});

// Verify reset OTP
router.post('/verify-reset-otp', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified for password reset
    user.resetPasswordToken = 'otp-verified';
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes to reset password
    user.clearOTP();
    await user.save();

    res.json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Reset password with OTP
router.post('/reset-password-with-otp', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: 'otp-verified',
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification. Please try again.' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password with OTP error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;