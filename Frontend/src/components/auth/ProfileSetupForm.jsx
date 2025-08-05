import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, User, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

export function ProfileSetupForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

  // Add password fields to the form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Add password validation
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/auth/login')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
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
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {userType === 'company' ? (
              // Company Profile Form
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={companyData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      onBlur={(e) => handleFieldBlur("companyName", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.companyName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter company name"
                    />
                    {fieldErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={companyData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={companyData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe your company..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={companyData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Size
                    </label>
                    <select
                      value={companyData.companySize}
                      onChange={(e) => handleInputChange("companySize", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      onBlur={(e) => handleFieldBlur("website", e.target.value, 'url')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Benefits (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={companyData.benefits.join(', ')}
                    onChange={(e) => handleArrayChange("benefits", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Health insurance, 401k, Remote work"
                  />
                </div>
              </>
            ) : (
              // User Profile Form
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.firstName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter first name"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.lastName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter last name"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={userData.headline}
                    onChange={(e) => handleInputChange("headline", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={userData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={userData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 5 years"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Employment Status
                    </label>
                    <select
                      value={userData.employmentStatus}
                      onChange={(e) => handleInputChange("employmentStatus", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Looking for opportunities">Looking for opportunities</option>
                      <option value="Open to opportunities">Open to opportunities</option>
                      <option value="Not looking">Not looking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={userData.skills.join(', ')}
                    onChange={(e) => handleArrayChange("skills", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="React, JavaScript, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="number"
                    value={userData.expectedSalary}
                    onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 80000"
                  />
                </div>
              </>
            )}

            {/* Add password fields to both company and user forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => handleFieldBlur("password", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      fieldErrors.password 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Create a password"
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={(e) => handleFieldBlur("confirmPassword", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      fieldErrors.confirmPassword 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Confirm your password"
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Setting up..." : "Complete Setup"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}