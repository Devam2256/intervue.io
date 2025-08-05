// Import required packages
const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/CompanyController");

// Define API routes for companies

// GET /api/companies - Get all companies
router.get("/companies", CompanyController.getCompanies);

// GET /api/companies/:id - Get a single company by ID
router.get("/companies/:id", CompanyController.getCompanyById);

// POST /api/companies - Create a new company
router.post("/companies", CompanyController.createCompany);

// PUT /api/companies/:id - Update an existing company
router.put("/companies/:id", CompanyController.updateCompany);

// DELETE /api/companies/:id - Delete a company
router.delete("/companies/:id", CompanyController.deleteCompany);

// Export the router to be used in the main app
module.exports = router;