import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [resetMethod, setResetMethod] = useState("email-link"); // email-link or otp

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = (value) => {
    const error = validateEmail(value);
    if (error) {
      setEmailError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    setLoading(true);

    try {
      // Choose the appropriate endpoint based on the selected reset method
      const endpoint = resetMethod === "email-link" 
        ? '/api/auth/forgot-password' 
        : '/api/auth/forgot-password-otp';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      if (resetMethod === "email-link") {
        setSuccess("Password reset email sent successfully! Please check your email for further instructions.");
      } else {
        setSuccess("Verification code sent successfully! Redirecting to verification page...");
        
        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          navigate(`/auth/verify-reset-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll help you reset your password.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={(e) => handleEmailBlur(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                    emailError 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reset Method
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={resetMethod === "email-link"}
                    onChange={() => setResetMethod("email-link")}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email Link</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={resetMethod === "otp"}
                    onChange={() => setResetMethod("otp")}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">OTP Verification</span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : resetMethod === "email-link" ? "Send Reset Link" : "Send Verification Code"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <Link to="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}