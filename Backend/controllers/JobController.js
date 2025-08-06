// Import the Job model
const Job = require("../models/Job");

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    // Find all jobs and populate company information
    const jobs = await Job.find().populate('company_id', 'name industry logo location companySize description website email phone');
    
    // Send success response with jobs data
    res.status(200).json(jobs);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get jobs by company ID
exports.getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Find jobs by company ID and populate company information
    const jobs = await Job.find({ company_id: companyId }).populate('company_id', 'name industry logo location companySize description website email phone');
    
    // Send success response with jobs data
    res.status(200).json(jobs);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    // Find job by ID and populate company information
    const job = await Job.findById(req.params.id).populate('company_id', 'name industry logo location companySize description website email phone');
    
    // If job not found, send 404 error
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Send success response with job data
    res.status(200).json(job);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    // Extract data from request body
    const {
      company_id,    // ID of the company posting the job
      title,         // Job title
      description,   // Job description
      category,      // Job category (Tech, Finance, etc.)
      type,          // Job type (Full-time, Part-time, etc.)
      location,      // Job location
      salary,        // Salary information
      priority,      // Job priority
      requirements,  // Array of requirements
      skills,        // Array of required skills
      benefits       // Array of benefits
    } = req.body;
    
    // Validate required fields
    if (!company_id) {
      return res.status(400).json({ error: 'Company ID is required' });
    }
    if (!title) {
      return res.status(400).json({ error: 'Job title is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Job description is required' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Job category is required' });
    }
    if (!type) {
      return res.status(400).json({ error: 'Job type is required' });
    }
    if (!location) {
      return res.status(400).json({ error: 'Job location is required' });
    }
    if (!salary) {
      return res.status(400).json({ error: 'Job salary is required' });
    }
    
    // Create new job with the extracted data
    const job = new Job({
      company_id,
      title,
      description,
      category,
      type,
      location,
      salary,
      priority,
      requirements,
      skills,
      benefits
    });
    
    // Save the job to database
    await job.save();
    
    // Send success response with created job data
    res.status(201).json(job);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    // Find and update job by ID
    // req.body contains the new data
    // { new: true } returns the updated document
    // { runValidators: true } runs validation on the update
    const job = await Job.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // If job not found, send 404 error
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Send success response with updated job data
    res.status(200).json(job);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    // Find and delete job by ID
    const job = await Job.findByIdAndDelete(req.params.id);
    
    // If job not found, send 404 error
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Send success response
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};