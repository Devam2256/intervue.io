// Import required packages
const express = require("express");
const router = express.Router();
const CandidateController = require("../controllers/CandidateController");

// Define API routes for candidates (job applications)

// GET /api/candidates - Get all candidates
router.get("/candidates", CandidateController.getCandidates);

// GET /api/candidates/job/:jobId - Get candidates for a specific job
router.get("/candidates/job/:jobId", CandidateController.getCandidatesByJob);

// GET /api/candidates/status/:status - Get candidates by status
router.get("/candidates/status/:status", CandidateController.getCandidatesByStatus);

// GET /api/candidates/stats - Get application statistics
router.get("/candidates/stats", CandidateController.getApplicationStats);

// GET /api/candidates/:id - Get a single candidate by ID
router.get("/candidates/:id", CandidateController.getCandidateById);

// POST /api/candidates - Create a new candidate (job application)
router.post("/candidates", CandidateController.createCandidate);

// PUT /api/candidates/:id - Update an existing candidate
router.put("/candidates/:id", CandidateController.updateCandidate);

// DELETE /api/candidates/:id - Delete a candidate
router.delete("/candidates/:id", CandidateController.deleteCandidate);

// Export the router to be used in the main app
module.exports = router; 