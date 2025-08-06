// Import the Candidate model
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");

// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    // Find all candidates and populate job and company information
    const candidates = await Candidate.find()
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name');
    
    // Send success response with candidates data
    res.status(200).json(candidates);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get candidates for a specific job
exports.getCandidatesByJob = async (req, res) => {
  try {
    // Find candidates by job ID and populate job information
    const candidates = await Candidate.find({ job_id: req.params.jobId })
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name');
    
    // Send success response with candidates data
    res.status(200).json(candidates);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get candidates for a specific user
exports.getCandidatesByUser = async (req, res) => {
  try {
    // Find candidates by user ID and populate job and company information
    const candidates = await Candidate.find({ user_id: req.params.userId })
      .populate('job_id', 'title company_id category type location salary')
      .populate('company_id', 'name industry logo');
    
    // Send success response with candidates data
    res.status(200).json(candidates);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get a single candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    // Find candidate by ID and populate job and company information
    const candidate = await Candidate.findById(req.params.id)
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name');
    
    // If candidate not found, send 404 error
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    // Send success response with candidate data
    res.status(200).json(candidate);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Create a new candidate (job application)
exports.createCandidate = async (req, res) => {
  try {
    // Check if user has already applied for this job
    const existingApplication = await Candidate.findOne({
      job_id: req.body.job_id,
      user_id: req.body.user_id
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create new candidate with data from request body
    const candidate = new Candidate(req.body);
    
    // Save the candidate to database
    await candidate.save();
    
    // Update the job's applications count
    await Job.findByIdAndUpdate(
      req.body.job_id,
      { $inc: { applicationsCount: 1 } }
    );
    
    // Send success response with created candidate data
    res.status(201).json(candidate);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Update a candidate (e.g., change status, add notes)
exports.updateCandidate = async (req, res) => {
  try {
    // Find and update candidate by ID
    // req.body contains the new data
    // { new: true } returns the updated document
    // { runValidators: true } runs validation on the update
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // If candidate not found, send 404 error
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    // Send success response with updated candidate data
    res.status(200).json(candidate);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
  try {
    // Find the candidate first to get the job_id
    const candidate = await Candidate.findById(req.params.id);
    
    // If candidate not found, send 404 error
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    // Delete the candidate
    await Candidate.findByIdAndDelete(req.params.id);
    
    // Decrease the job's applications count
    await Job.findByIdAndUpdate(
      candidate.job_id,
      { $inc: { applicationsCount: -1 } }
    );
    
    // Send success response
    res.status(200).json({ message: "Candidate application deleted successfully" });
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get candidates by status
exports.getCandidatesByStatus = async (req, res) => {
  try {
    // Find candidates by status and populate job information
    const candidates = await Candidate.find({ status: req.params.status })
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name');
    
    // Send success response with candidates data
    res.status(200).json(candidates);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get application statistics
exports.getApplicationStats = async (req, res) => {
  try {
    // Get total applications count
    const totalApplications = await Candidate.countDocuments();
    
    // Get applications by status
    const applicationsByStatus = await Candidate.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get applications by job
    const applicationsByJob = await Candidate.aggregate([
      {
        $group: {
          _id: '$job_id',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job'
        }
      }
    ]);
    
    // Send success response with statistics
    res.status(200).json({
      totalApplications,
      applicationsByStatus,
      applicationsByJob
    });
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Schedule interview for a candidate
exports.scheduleInterview = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { meetLink, interviewType = 'google-meet' } = req.body;

    // Find candidate and populate related data
    const candidate = await Candidate.findById(candidateId)
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name email')
      .populate('user_id', 'email firstName lastName');

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Update candidate status to 'Scheduled'
    candidate.status = 'Scheduled';
    candidate.interviewSchedule = {
      scheduledAt: new Date(),
      location: interviewType === 'video-call' ? 'Video Call' : 'Google Meet',
      notes: interviewType === 'video-call' ? 'Interview scheduled via Video Call' : 'Interview scheduled via Google Meet',
      interviewType: interviewType
    };
    await candidate.save();

    // Send email notifications
    const { sendEmail } = require('../config/email');
    
    // Email to candidate
    const candidateEmail = candidate.user_id.email;
    const candidateName = `${candidate.user_id.firstName} ${candidate.user_id.lastName}`;
    const jobTitle = candidate.job_id.title;
    const companyName = candidate.company_id.name;
    
    const applicationDetails = {
      appliedAt: candidate.createdAt,
      expectedSalary: candidate.expectedSalary || 'Not specified',
      availability: candidate.availability || 'Not specified'
    };

    await sendEmail(candidateEmail, 'interviewScheduled', candidateName, jobTitle, companyName, meetLink, applicationDetails, interviewType);

    // Email to company (if company email is available)
    if (candidate.company_id.email) {
      await sendEmail(candidate.company_id.email, 'interviewScheduled', companyName, jobTitle, companyName, meetLink, applicationDetails, interviewType);
    }

    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject a candidate
exports.rejectCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Find candidate and populate related data
    const candidate = await Candidate.findById(candidateId)
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name')
      .populate('user_id', 'email firstName lastName');

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Update candidate status to 'Rejected'
    candidate.status = 'Rejected';
    await candidate.save();

    // Send rejection email to candidate
    const { sendEmail } = require('../config/email');
    
    const candidateEmail = candidate.user_id.email;
    const candidateName = `${candidate.user_id.firstName} ${candidate.user_id.lastName}`;
    const jobTitle = candidate.job_id.title;
    const companyName = candidate.company_id.name;
    
    const applicationDetails = {
      appliedAt: candidate.createdAt,
      expectedSalary: candidate.expectedSalary || 'Not specified',
      availability: candidate.availability || 'Not specified'
    };

    await sendEmail(candidateEmail, 'applicationRejection', candidateName, jobTitle, companyName, applicationDetails);

    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept a candidate (after interview)
exports.acceptCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Find candidate and populate related data
    const candidate = await Candidate.findById(candidateId)
      .populate('job_id', 'title company_id')
      .populate('company_id', 'name')
      .populate('user_id', 'email firstName lastName');

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Update candidate status to 'Accepted'
    candidate.status = 'Accepted';
    await candidate.save();

    // Send acceptance email to candidate
    const { sendEmail } = require('../config/email');
    
    const candidateEmail = candidate.user_id.email;
    const candidateName = `${candidate.user_id.firstName} ${candidate.user_id.lastName}`;
    const jobTitle = candidate.job_id.title;
    const companyName = candidate.company_id.name;
    
    const applicationDetails = {
      appliedAt: candidate.createdAt,
      expectedSalary: candidate.expectedSalary || 'Not specified',
      availability: candidate.availability || 'Not specified'
    };

    await sendEmail(candidateEmail, 'applicationAccepted', candidateName, jobTitle, companyName, applicationDetails);

    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};