// Import the Company model
const Company = require("../models/Company");

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    // Find all companies in the database
    const companies = await Company.find();
    
    // Send success response with companies data
    res.status(200).json(companies);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Get a single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    // Find company by ID from URL parameters
    const company = await Company.findById(req.params.id);
    
    // If company not found, send 404 error
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    
    // Send success response with company data
    res.status(200).json(company);
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    // Create new company with data from request body
    const company = new Company(req.body);
    
    // Save the company to database
    await company.save();
    
    // Send success response with created company data
    res.status(201).json(company);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  try {
    // Find and update company by ID
    // req.body contains the new data
    // { new: true } returns the updated document
    // { runValidators: true } runs validation on the update
    const company = await Company.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    // If company not found, send 404 error
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    
    // Send success response with updated company data
    res.status(200).json(company);
  } catch (err) {
    // Send error response if validation fails or something goes wrong
    res.status(400).json({ error: err.message });
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    // Find and delete company by ID
    const company = await Company.findByIdAndDelete(req.params.id);
    
    // If company not found, send 404 error
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    
    // Send success response
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    // Send error response if something goes wrong
    res.status(500).json({ error: err.message });
  }
};
