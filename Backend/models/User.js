const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Changed from 'bcrypt' to 'bcryptjs'

const userSchema = new mongoose.Schema({
  u_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return this.isEmailVerified === true && this.isProfileComplete === true;
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  userType: {
    type: String,
    enum: ['user', 'company'],
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  // User Profile Fields
  firstName: {
    type: String,
    required: function() {
      return this.userType === 'user' && this.isProfileComplete === true;
    },
    trim: true
  },
  lastName: {
    type: String,
    required: function() {
      return this.userType === 'user' && this.isProfileComplete === true;
    },
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  headline: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  employmentStatus: {
    type: String,
    enum: ['Employed', 'Unemployed', 'Student', 'Freelancer', 'Looking for opportunities', 'Open to opportunities', 'Not looking'],
    default: 'Looking for opportunities'
  },
  currentCompany: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number,
    description: String
  }],
  workExperience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String
  }],
  portfolio: {
    type: String,
    trim: true
  },
  socialMedia: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  expectedSalary: {
    type: String,
    trim: true
  },
  availability: {
    type: String,
    enum: ['Immediately', '2 weeks', '1 month', '3 months', 'Other'],
    default: 'Immediately'
  },
  preferredCategories: [{
    type: String,
    trim: true
  }],
  preferredJobTypes: [{
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    default: ['Full-time']
  }],
  preferredLocations: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  emailPreferences: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    applicationUpdates: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: false
    }
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to set fullName
userSchema.pre('save', function(next) {
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// OTP methods
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  };
  return otp;
};

userSchema.methods.verifyOTP = function(inputOtp) {
  if (!this.otp?.code || !this.otp?.expiresAt) return false;
  if (new Date() > this.otp.expiresAt) return false;
  return this.otp.code === inputOtp;
};

userSchema.methods.clearOTP = function() {
  this.otp = undefined;
};

module.exports = mongoose.model('User', userSchema);