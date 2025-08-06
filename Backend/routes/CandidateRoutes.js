// Import required packages
const express = require("express");
const router = express.Router();
const CandidateController = require("../controllers/CandidateController");

// Define API routes for candidates (job applications)

// GET /api/candidates - Get all candidates
router.get("/candidates", CandidateController.getCandidates);

// GET /api/candidates/job/:jobId - Get candidates for a specific job
router.get("/candidates/job/:jobId", CandidateController.getCandidatesByJob);

// GET /api/candidates/user/:userId - Get candidates for a specific user
router.get("/candidates/user/:userId", CandidateController.getCandidatesByUser);

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

// POST /api/candidates/:candidateId/schedule - Schedule interview for a candidate
router.post("/candidates/:candidateId/schedule", CandidateController.scheduleInterview);

// POST /api/candidates/:candidateId/reject - Reject a candidate
router.post("/candidates/:candidateId/reject", CandidateController.rejectCandidate);

// POST /api/candidates/:candidateId/accept - Accept a candidate
router.post("/candidates/:candidateId/accept", CandidateController.acceptCandidate);

// DELETE /api/candidates/:id - Delete a candidate
router.delete("/candidates/:id", CandidateController.deleteCandidate);

// Export the router to be used in the main app
module.exports = router; 