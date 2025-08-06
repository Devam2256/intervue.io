const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewing', 'Interview', 'Scheduled', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  experience: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  resume: {
    type: String
  },
  coverLetter: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  avatar: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  interviewSchedule: {
    scheduledAt: Date,
    interviewer: String,
    location: String,
    notes: String
  },
  applicationNotes: String,
  source: {
    type: String,
    enum: ['Website', 'LinkedIn', 'Indeed', 'Referral', 'Other'],
    default: 'Website'
  },
  currentlyEmployed: {
    type: Boolean,
    default: false
  },
  expectedSalary: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: String,
    enum: ['Immediately', '2 weeks', '1 month', '3 months', 'Other'],
    default: 'Immediately'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
candidateSchema.index({ job_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Candidate', candidateSchema);