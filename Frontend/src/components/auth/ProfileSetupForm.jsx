import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, User, ArrowLeft, Save, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "../common/ui/Button";
import { Input, Textarea, Select, Label } from "../common/ui/Input";
import { Card } from "../common/ui/Card";

export function ProfileSetupForm({ onProfileComplete }) {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Company form data
  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    description: "",
    location: "",
    companySize: "",
    website: "",
    phone: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: ""
    },
    benefits: []
  });

  // User form data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    headline: "",
    bio: "",
    experience: "",
    employmentStatus: "Looking for opportunities",
    skills: [],
    education: [],
    workExperience: [],
    portfolio: {
      website: "",
      github: "",
      linkedin: "",
      twitter: ""
    },
    expectedSalary: ""
  });

  useEffect(() => {
    // Check session to get user type
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.isAuthenticated) {
        setUserType(data.user.userType);
      } else {
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Session check error:', error);
      navigate('/auth/login');
    }
  };

  const validateField = (field, value, type = 'text') => {
    if (!value || value.trim() === '') {
      return `${field} is required`;
    }
    
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (type === 'url') {
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        return 'Please enter a valid URL';
      }
    }
    
    return null;
  };

  const handleInputChange = (field, value, parent = null) => {
    if (parent) {
      if (userType === 'company') {
        setCompanyData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: value
          }
        }));
      } else {
        setUserData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: value
          }
        }));
      }
    } else {
      if (userType === 'company') {
        setCompanyData(prev => ({ ...prev, [field]: value }));
      } else {
        setUserData(prev => ({ ...prev, [field]: value }));
      }
    }

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFieldBlur = (field, value, type = 'text') => {
    let error;
    
    if (field === "password") {
      error = validatePassword(value);
    } else if (field === "confirmPassword") {
      error = validateConfirmPassword(value);
    } else {
      error = validateField(field, value, type);
    }
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleArrayChange = (field, value) => {
    if (userType === 'company') {
      setCompanyData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
    } else {
      setUserData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
    }
  };

  // Password validation functions
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };
  
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return null;
  };
  
  // Modify the handleSubmit function to include password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
  
    // Validate required fields including password
    const errors = {};
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);
    
    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    if (userType === 'company') {
      const companyNameError = validateField('Company Name', companyData.companyName);
      if (companyNameError) errors.companyName = companyNameError;
    } else {
      const firstNameError = validateField('First Name', userData.firstName);
      const lastNameError = validateField('Last Name', userData.lastName);
      if (firstNameError) errors.firstName = firstNameError;
      if (lastNameError) errors.lastName = lastNameError;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Add password to the data being sent
      const endpoint = userType === 'company' ? '/api/profile/setup/company' : '/api/profile/setup/user';
      const data = userType === 'company' ? 
        { ...companyData, password } : 
        { ...userData, password };
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
  
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Profile setup failed');
      }

      setSuccess("Profile setup successful! Redirecting to dashboard...");

      // Call the onProfileComplete callback to refresh user data
      if (onProfileComplete) {
        onProfileComplete();
      }

      // Redirect to appropriate dashboard after 2 seconds
      setTimeout(() => {
        if (userType === 'company') {
          console.log('Redirecting to company dashboard...');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('Redirecting to user dashboard...');
          navigate('/user', { replace: true });
        }
      }, 2000);

    } catch (error) {
      console.error('Profile setup submission error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative z-20 w-full h-full p-4 sm:p-8">
        {/* Success Message */}
        {success && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {success}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="sleek"
              onClick={() => navigate('/auth/login')}
              className="flex items-center gap-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Complete Your Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set up your {userType === 'company' ? 'company' : 'professional'} profile to get started
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {userType === 'company' ? (
              <Building className="h-5 w-5 text-blue-600" />
            ) : (
              <User className="h-5 w-5 text-green-600" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {userType}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {userType === 'company' ? (
                // Company Profile Form
                <>
                  {/* Basic Information */}
                  <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName" required>
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          value={companyData.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          onBlur={(e) => handleFieldBlur("companyName", e.target.value)}
                          placeholder="Enter company name"
                          required
                        />
                        {fieldErrors.companyName && (
                          <p className="text-red-500 text-sm mt-1">{fieldErrors.companyName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="industry">
                          Industry
                        </Label>
                        <Input
                          id="industry"
                          value={companyData.industry}
                          onChange={(e) => handleInputChange("industry", e.target.value)}
                          placeholder="e.g., Technology, Healthcare"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">
                          Company Description
                        </Label>
                        <Textarea
                          id="description"
                          value={companyData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Describe your company..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={companyData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="City, State"
                          />
                        </div>

                        <div>
                          <Label htmlFor="companySize">
                            Company Size
                          </Label>
                          <Select
                            value={companyData.companySize}
                            onValueChange={(value) => handleInputChange("companySize", value)}
                            options={[
                              { value: "1-10", label: "1-10 employees" },
                              { value: "11-50", label: "11-50 employees" },
                              { value: "51-200", label: "51-200 employees" },
                              { value: "201-500", label: "201-500 employees" },
                              { value: "500+", label: "500+ employees" }
                            ]}
                            placeholder="Select size"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="website">
                            Website
                          </Label>
                          <Input
                            id="website"
                            type="url"
                            value={companyData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            onBlur={(e) => handleFieldBlur("website", e.target.value, 'url')}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={companyData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="benefits">
                          Benefits (comma-separated)
                        </Label>
                        <Input
                          id="benefits"
                          value={companyData.benefits.join(', ')}
                          onChange={(e) => handleArrayChange("benefits", e.target.value)}
                          placeholder="Health insurance, 401k, Remote work"
                        />
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                // User Profile Form
                <>
                  {/* Basic Information */}
                  <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" required>
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={userData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                            placeholder="Enter first name"
                            required
                          />
                          {fieldErrors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="lastName" required>
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={userData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                            placeholder="Enter last name"
                            required
                          />
                          {fieldErrors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={userData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <Label htmlFor="location">
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={userData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="City, State"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="headline">
                          Professional Headline
                        </Label>
                        <Input
                          id="headline"
                          value={userData.headline}
                          onChange={(e) => handleInputChange("headline", e.target.value)}
                          placeholder="e.g., Senior Frontend Developer"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bio">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={userData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="experience">
                            Years of Experience
                          </Label>
                          <Input
                            id="experience"
                            value={userData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            placeholder="e.g., 5 years"
                          />
                        </div>

                        <div>
                          <Label htmlFor="employmentStatus">
                            Employment Status
                          </Label>
                          <Select
                            value={userData.employmentStatus}
                            onValueChange={(value) => handleInputChange("employmentStatus", value)}
                            options={[
                              { value: "Looking for opportunities", label: "Looking for opportunities" },
                              { value: "Open to opportunities", label: "Open to opportunities" },
                              { value: "Not looking", label: "Not looking" }
                            ]}
                            placeholder="Select status"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="skills">
                          Skills (comma-separated)
                        </Label>
                        <Input
                          id="skills"
                          value={userData.skills.join(', ')}
                          onChange={(e) => handleArrayChange("skills", e.target.value)}
                          placeholder="React, JavaScript, Node.js"
                        />
                      </div>

                      <div>
                        <Label htmlFor="expectedSalary">
                          Expected Salary
                        </Label>
                        <Input
                          id="expectedSalary"
                          type="number"
                          value={userData.expectedSalary}
                          onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                          placeholder="e.g., 80000"
                        />
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Password Section */}
              <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password" required>
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onBlur={(e) => handleFieldBlur("password", e.target.value)}
                          placeholder="Create a password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" required>
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={(e) => handleFieldBlur("confirmPassword", e.target.value)}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      userType === 'company' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {userType === 'company' ? (
                        <Building className="w-6 h-6 text-white" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {userType === 'company' ? companyData.companyName : `${userData.firstName} ${userData.lastName}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {userType === 'company' ? companyData.industry : userData.headline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {userType === 'company' ? companyData.description : userData.bio}
                  </p>

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {userType === 'company' ? (
                      <>
                        <p>📍 {companyData.location}</p>
                        <p>👥 {companyData.companySize} employees</p>
                      </>
                    ) : (
                      <>
                        <p>📍 {userData.location}</p>
                        <p>💼 {userData.employmentStatus}</p>
                        <p>🎯 {userData.experience} experience</p>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Setting up..." : "Complete Setup"}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}