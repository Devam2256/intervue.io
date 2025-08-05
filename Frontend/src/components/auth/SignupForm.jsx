import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";

export function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    userType: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: ""
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validateUserType = (userType) => {
    if (!userType) return "Please select a user type";
    return null;
  };

  const validateName = (name, fieldName) => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFieldBlur = (field, value) => {
    let error = null;
    if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'password') {
      error = validatePassword(value);
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(value);
    } else if (field === 'userType') {
      error = validateUserType(value);
    } else if (field === 'firstName') {
      error = validateName(value, 'First name');
    } else if (field === 'lastName') {
      error = validateName(value, 'Last name');
    } else if (field === 'companyName') {
      error = validateName(value, 'Company name');
    }
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate required fields
    const errors = {};
    const emailError = validateEmail(formData.email);
    const userTypeError = validateUserType(formData.userType);

    if (emailError) errors.email = emailError;
    if (userTypeError) errors.userType = userTypeError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess("Registration successful! Please check your email for verification code.");
      localStorage.setItem("signupEmail", formData.email);
      localStorage.setItem("signupUserType", formData.userType);
      setStep(2);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  // Handle OTP verification
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });
  
      setSuccess(response.data.message);
      localStorage.setItem('signupData', JSON.stringify({
        email: formData.email,
        userType: formData.userType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName
      }));
  
      // Redirect directly to profile setup instead of password setup
      setTimeout(() => {
        navigate('/profile-setup');
      }, 2000);
  
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setSuccess("Verification code sent successfully!");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("SignupForm rendered, step:", step);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 1 ? "Join InterVue.io to get started" : "Enter the verification code sent to your email"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {success}
              </div>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRegistration} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => handleFieldBlur("email", e.target.value)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                      fieldErrors.email 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter your email"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("userType", "user")}
                    className={`p-3 border rounded-md flex items-center justify-center ${
                      formData.userType === "user"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("userType", "company")}
                    className={`p-3 border rounded-md flex items-center justify-center ${
                      formData.userType === "company"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Building className="h-5 w-5 mr-2" />
                    Employer
                  </button>
                </div>
                {fieldErrors.userType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.userType}</p>
                )}
              </div>

              {formData.userType === "user" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.firstName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="First name"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${
                        fieldErrors.lastName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Last name"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {formData.userType === "company" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    onBlur={(e) => handleFieldBlur("companyName", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${
                      fieldErrors.companyName 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Company name"
                  />
                  {fieldErrors.companyName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.companyName}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={(e) => handleFieldBlur("password", e.target.value)}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${
                      fieldErrors.password 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
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
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onBlur={(e) => handleFieldBlur("confirmPassword", e.target.value)}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${
                      fieldErrors.confirmPassword 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
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

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}