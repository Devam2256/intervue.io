const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  j_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Finance', 'Healthcare', 'Operations', 'Management']
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Closed'],
    default: 'Active'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
    default: 'Mid'
  },
  remoteWork: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  applicationsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  expiresAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  additionalInfo: {
    type: String,
    trim: true
  },
  viewsCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);