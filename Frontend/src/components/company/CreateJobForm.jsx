// CreateJobForm: Form for creating or editing job postings
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../common/ui/Button"
import { Input, Textarea, Select, Label } from "../common/ui/Input"
import { X, Plus, ArrowLeft } from "lucide-react"
import { Card } from "../common/ui/Card";

// Predefined options for dropdown menus
const categoryOptions = [
  { value: "Tech", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Operations", label: "Operations" },
  { value: "Management", label: "Management" },
]

const typeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
]

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
]

export function CreateJobForm({ asPage = false, editMode = false, profile }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID for editing
  
  // Debug profile data
  console.log('CreateJobForm - Profile data:', profile);
  console.log('CreateJobForm - Profile ID:', profile?._id);
  console.log('CreateJobForm - Profile name:', profile?.name);

  // Form data state - holds all the job information
  const [formData, setFormData] = useState(() => ({
    title: "",           // Job title
    description: "",     // Job description
    category: "",        // Job category
    type: "",           // Job type (full-time, part-time, etc.)
    location: "",       // Job location
    salary: "",         // Salary information
    priority: "Medium", // Job priority
    requirements: [""], // Array of job requirements
    skills: [""],       // Array of required skills
    benefits: [""],     // Array of job benefits
  }));

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch job data when in edit mode
  useEffect(() => {
    if (editMode && id) {
      const fetchJobData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/jobs/${id}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            const jobData = data.job || data;
            setFormData({
              title: jobData.title || "",
              description: jobData.description || "",
              category: jobData.category || "",
              type: jobData.type || "",
              location: jobData.location || "",
              salary: jobData.salary || "",
              priority: jobData.priority || "Medium",
              requirements: jobData.requirements && jobData.requirements.length > 0 ? jobData.requirements : [""],
              skills: jobData.skills && jobData.skills.length > 0 ? jobData.skills : [""],
              benefits: jobData.benefits && jobData.benefits.length > 0 ? jobData.benefits : [""],
            });
          } else {
            setError("Failed to fetch job data");
          }
        } catch (error) {
          setError("Error fetching job data");
        } finally {
          setLoading(false);
        }
      };
      
      fetchJobData();
    }
  }, [editMode, id]);

  // Validation functions
  const validateSalary = (value) => {
    if (value && !/^[0-9,\s\-$]+$/.test(value)) {
      return "Salary can only contain numbers, commas, spaces, hyphens, and dollar signs";
    }
    return "";
  };

  const validateJobTitle = (value) => {
    if (value && !/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
      return "Job title can only contain letters, numbers, spaces, hyphens, and underscores";
    }
    return "";
  };

  const validateLocation = (value) => {
    if (value && !/^[a-zA-Z0-9\s\-_,]+$/.test(value)) {
      return "Location can only contain letters, numbers, spaces, hyphens, underscores, and commas";
    }
    return "";
  };

  const validateRequirement = (value) => {
    if (value && !/^[a-zA-Z0-9\s\-_.,]+$/.test(value)) {
      return "Requirements can only contain letters, numbers, spaces, hyphens, underscores, commas, and periods";
    }
    return "";
  };

  // Function to update single form fields with validation
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Function to validate field on blur
  const handleFieldBlur = (field, value) => {
    let error = "";
    
    switch (field) {
      case "salary":
        error = validateSalary(value);
        break;
      case "title":
        error = validateJobTitle(value);
        break;
      case "location":
        error = validateLocation(value);
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Function to update array fields (requirements, skills, benefits) with validation
  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));

    // Clear field error when user starts typing
    const errorKey = `${field}_${index}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors(prev => ({
        ...prev,
        [errorKey]: ""
      }));
    }
  };

  // Function to validate array field on blur
  const handleArrayFieldBlur = (field, index, value) => {
    let error = "";
    
    if (field === "requirements") {
      error = validateRequirement(value);
    }

    const errorKey = `${field}_${index}`;
    setFieldErrors(prev => ({
      ...prev,
      [errorKey]: error
    }));
  };

  // Function to add new items to array fields
  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // Function to remove items from array fields
  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

    // Clear error for removed field
    const errorKey = `${field}_${index}`;
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });
  };

  // Function to handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    
    // Check required fields
    const requiredFields = ['title', 'description', 'category', 'type', 'location', 'salary'];
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Validate salary
    if (formData.salary && formData.salary.trim()) {
      const salaryError = validateSalary(formData.salary);
      if (salaryError) errors.salary = salaryError;
    }
    
    // Validate job title
    if (formData.title && formData.title.trim()) {
      const titleError = validateJobTitle(formData.title);
      if (titleError) errors.title = titleError;
    }
    
    // Validate location
    if (formData.location && formData.location.trim()) {
      const locationError = validateLocation(formData.location);
      if (locationError) errors.location = locationError;
    }
    
    // Validate requirements
    formData.requirements.forEach((req, index) => {
      if (req.trim()) {
        const reqError = validateRequirement(req);
        if (reqError) errors[`requirements_${index}`] = reqError;
      }
    });

    // If there are validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use company ID from profile
      const company_id = profile?._id;
      
      if (!company_id) {
        throw new Error("Company profile not found. Please complete your company profile first.");
      }
      
      // Prepare data to send to backend
      const payload = { ...formData, company_id };
      
      console.log('Creating job with payload:', payload);
      console.log('Company ID:', company_id);
      console.log('Job title:', formData.title);
      console.log('Job category:', formData.category);
      console.log('Job type:', formData.type);
      
      // Determine the API endpoint and method based on edit mode
      const url = editMode ? `/api/jobs/${id}` : "/api/jobs";
      const method = editMode ? "PUT" : "POST";
      
      console.log('Making request to:', url, 'with method:', method);
      
      // Send request to create or update job
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      // Check if request was successful
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || (editMode ? "Failed to update job" : "Failed to create job"));
      }

      // Parse response
      await res.json();
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || (editMode ? "Error updating job" : "Error creating job"));
    } finally {
      setLoading(false);
    }
  };

  // Only show the form if it's being used as a full page
  if (!asPage) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header section with buttons for desktop */}
      <div className="hidden sm:flex justify-between items-center gap-4 p-4">
        <Button variant="sleek" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        <Button type="submit" form="job-form" disabled={loading} className="flex items-center gap-2">
          {loading ? (editMode ? "Saving..." : "Creating...") : (editMode ? "Save Changes" : "Create Job")}
        </Button>
      </div>
      {/* Mobile fixed bottom bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between px-6 py-2 gap-2 shadow-lg">
        <Button variant="sleek" onClick={() => navigate('/dashboard')} className="flex-1 flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" form="job-form" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
          {loading ? (editMode ? "Saving..." : "Creating...") : (editMode ? "Save Changes" : "Create Job")}
        </Button>
      </div>
      {/* Main form container - full width */}
      <div className="w-full p-4 sm:p-6">
        <form id="job-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
                {/* Job Title */}
                <div>
                  <Label htmlFor="title" required>Job Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => handleInputChange("title", e.target.value)} 
                    onBlur={(e) => handleFieldBlur("title", e.target.value)}
                    placeholder="e.g. Senior Frontend Developer" 
                    required 
                  />
                  {fieldErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
                  )}
                </div>

                {/* Category and Job Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" required>Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange("category", value)} 
                      options={categoryOptions} 
                      placeholder="Select category" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" required>Job Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleInputChange("type", value)} 
                      options={typeOptions} 
                      placeholder="Select job type" 
                    />
                  </div>
                </div>

                {/* Location and Salary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" required>Location</Label>
                    <Input 
                      id="location" 
                      value={formData.location} 
                      onChange={(e) => handleInputChange("location", e.target.value)} 
                      onBlur={(e) => handleFieldBlur("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote" 
                      required 
                    />
                    {fieldErrors.location && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input 
                      id="salary" 
                      value={formData.salary} 
                      onChange={(e) => handleInputChange("salary", e.target.value)} 
                      onBlur={(e) => handleFieldBlur("salary", e.target.value)}
                      placeholder="e.g. $80,000 - $120,000" 
                    />
                    {fieldErrors.salary && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.salary}</p>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => handleInputChange("priority", value)} 
                      options={priorityOptions} 
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <Label htmlFor="description" required>Job Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => handleInputChange("description", e.target.value)} 
                    placeholder="Describe the role, responsibilities, and what you're looking for..." 
                    rows={4} 
                    required 
                  />
                </div>
              </div>
          </Card>
          {/* Requirements, Skills, Benefits Section */}
          <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements, Skills & Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Requirements Section */}
                <div>
                  <Label>Requirements</Label>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={req} 
                          onChange={(e) => handleArrayChange("requirements", index, e.target.value)} 
                          onBlur={(e) => handleArrayFieldBlur("requirements", index, e.target.value)}
                          placeholder="e.g. 3+ years of React experience" 
                        />
                        {formData.requirements.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={() => removeArrayItem("requirements", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {fieldErrors[`requirements_${formData.requirements.length - 1}`] && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors[`requirements_${formData.requirements.length - 1}`]}</p>
                    )}
                    <Button 
                      type="button" 
                      variant="sleek" 
                      size="sm" 
                      onClick={() => addArrayItem("requirements")} 
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Requirement
                    </Button>
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <Label>Required Skills</Label>
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={skill} 
                          onChange={(e) => handleArrayChange("skills", index, e.target.value)} 
                          placeholder="e.g. React, TypeScript, Node.js" 
                        />
                        {formData.skills.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={() => removeArrayItem("skills", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="sleek" 
                      size="sm" 
                      onClick={() => addArrayItem("skills")} 
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Skill
                    </Button>
                  </div>
                </div>

                {/* Benefits Section */}
                <div>
                  <Label>Benefits</Label>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={benefit} 
                          onChange={(e) => handleArrayChange("benefits", index, e.target.value)} 
                          placeholder="e.g. Health insurance, Remote work, 401k" 
                        />
                        {formData.benefits.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={() => removeArrayItem("benefits", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="sleek" 
                      size="sm" 
                      onClick={() => addArrayItem("benefits")} 
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Benefit
                    </Button>
                  </div>
                </div>
              </div>
          </Card>
          {/* Error message */}
          {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}