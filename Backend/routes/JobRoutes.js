// Import required packages
const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");

// Define API routes for jobs

// GET /api/jobs - Get all jobs
router.get("/jobs", JobController.getJobs);

// GET /api/jobs/:id - Get a single job by ID
router.get("/jobs/:id", JobController.getJobById);

// POST /api/jobs - Create a new job
router.post("/jobs", JobController.createJob);

// PUT /api/jobs/:id - Update an existing job
router.put("/jobs/:id", JobController.updateJob);

// DELETE /api/jobs/:id - Delete a job
router.delete("/jobs/:id", JobController.deleteJob);

// Export the router to be used in the main app
module.exports = router; 