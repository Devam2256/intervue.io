// App.jsx: Main entry point for the InterVue job portal application
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { CompanyDashboard } from "./components/company/CompanyDashboard"
import { JobDetail } from "./components/company/JobDetail"
import { ProfileSetup } from "./components/company/ProfileSetup"
import { SleekNavbar } from "./components/company/SleekNavbar";
import { CreateJobForm } from "./components/company/CreateJobForm";
import { UserDashboard } from "./components/user/UserDashboard"
import { UserProfile } from "./components/user/UserProfile"
import { UserJobDetail } from "./components/user/UserJobDetail"
import { LandingPage } from "./components/auth/LandingPage"
import { LoginForm } from "./components/auth/LoginForm"
import { SignupForm } from "./components/auth/SignupForm"
import { ForgotPasswordForm } from "./components/auth/ForgotPasswordForm"
import { ResetPasswordForm } from "./components/auth/ResetPasswordForm"
import { ProfileSetupForm } from "./components/auth/ProfileSetupForm"
import { OTPVerificationForm } from "./components/auth/OTPVerificationForm"
// Remove this import
// import { SetPasswordForm } from "./components/auth/SetPasswordForm";
import "./App.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Protected Route Component with Session Check
function ProtectedRoute({ children, userType }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (userType && user.userType !== userType) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Profile Setup Route Component
function ProfileSetupRoute({ children }) {
  const [requiresProfileSetup, setRequiresProfileSetup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProfileSetup();
  }, []);

  const checkProfileSetup = async () => {
    try {
      const response = await fetch('/api/profile/setup-status', {
        credentials: 'include'
      });
      const data = await response.json();
      
      setRequiresProfileSetup(!data.isComplete);
    } catch (error) {
      setRequiresProfileSetup(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requiresProfileSetup) {
    return <ProfileSetupForm />;
  }

  return children;
}

function App() {
  // Company profile state - will be fetched from database
  const [profile, setProfile] = useState(null);
  // User profile state - will be fetched from database
  const [user, setUser] = useState(null);
  const [_loading, setLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState(0); // Add this to force re-fetch
  
  // Navigation function
  const navigate = useNavigate();
  
  // Fetch profile data on component mount
  const fetchProfileData = async () => {
    try {
      // Check if user is authenticated
      const sessionResponse = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      const sessionData = await sessionResponse.json();
      
      if (sessionData.isAuthenticated && sessionData.user && sessionData.user._id) {
        // Fetch appropriate profile based on user type
        if (sessionData.user.userType === 'company') {
          try {
            const companyResponse = await fetch(`/api/profile/company`, {
              credentials: 'include'
            });
            
            if (companyResponse.ok) {
              const companyData = await companyResponse.json();
              setProfile(companyData.profile);
            }
          } catch (error) {
            // Handle error silently
          }
        } else {
          try {
            const userResponse = await fetch(`/api/profile/user`, {
              credentials: 'include'
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData.profile);
            }
          } catch (error) {
            // Handle error silently
          }
        }
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh profile data
  const refreshProfileData = () => {
    setSessionKey(prev => prev + 1);
  };
  
  useEffect(() => {
    fetchProfileData();
  }, [sessionKey]);

  // Listen for login events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'loginEvent') {
        refreshProfileData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleUserProfileClick = () => {
    navigate("/user/profile");
  };

  return (
    // Main app container
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden overflow-y-auto">
      {/* Route definitions - different pages of the app */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
        <Route path="/auth/verify-reset-otp" element={<OTPVerificationForm />} />
        <Route path="/auth/verify-otp" element={<OTPVerificationForm />} />
        
        {/* Remove this route */}
        {/* <Route path="/auth/set-password" element={<SetPasswordForm />} /> */}
        
        {/* Profile Setup Route */}
        <Route path="/profile-setup" element={<ProfileSetupForm onProfileComplete={refreshProfileData} />} />
        
        {/* Protected Company Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute userType="company">
            <ProfileSetupRoute>
              <div>
                <SleekNavbar 
                  profile={{ ...profile, userType: 'company' }} 
                  onProfileClick={handleProfileClick} 
                />
                <CompanyDashboard profile={profile} />
              </div>
            </ProfileSetupRoute>
          </ProtectedRoute>
        } />
        
        {/* Company job creation route */}
        <Route path="/company/jobs/new" element={
          <ProtectedRoute userType="company">
            <div>
              <SleekNavbar 
                profile={{ ...profile, userType: 'company' }} 
                onProfileClick={handleProfileClick} 
              />
              <CreateJobForm asPage={true} profile={profile} />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Company job edit route */}
        <Route path="/company/jobs/edit/:id" element={
          <ProtectedRoute userType="company">
            <div>
              <SleekNavbar 
                profile={{ ...profile, userType: 'company' }} 
                onProfileClick={handleProfileClick} 
              />
              <CreateJobForm asPage={true} editMode={true} profile={profile} />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Company job detail route */}
        <Route path="/job/:id" element={
          <ProtectedRoute userType="company">
            <div>
              <SleekNavbar 
                profile={{ ...profile, userType: 'company' }} 
                onProfileClick={handleProfileClick} 
              />
              <JobDetail />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Company profile route */}
        <Route path="/profile" element={
          <ProtectedRoute userType="company">
            <div>
              <SleekNavbar 
                profile={{ ...profile, userType: 'company' }} 
                onProfileClick={handleProfileClick} 
              />
              <ProfileSetup profile={profile} onProfileComplete={refreshProfileData} />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Protected User Routes - Add SleekNavbar */}
        <Route path="/user" element={
          <ProtectedRoute userType="user">
            <ProfileSetupRoute>
              <div>
                <SleekNavbar 
                  profile={{ ...user, userType: 'user' }} 
                  onProfileClick={handleUserProfileClick} 
                />
                <UserDashboard user={user} />
              </div>
            </ProfileSetupRoute>
          </ProtectedRoute>
        } />
        <Route path="/user/profile" element={
          <ProtectedRoute userType="user">
            <div>
              <SleekNavbar 
                profile={{ ...user, userType: 'user' }} 
                onProfileClick={handleUserProfileClick} 
              />
              <UserProfile 
                user={user} 
                setUser={setUser}
                onProfileUpdate={refreshProfileData}
              />
            </div>
          </ProtectedRoute>
        } />
        <Route path="/user/job/:id" element={
          <ProtectedRoute userType="user">
            <div>
              <SleekNavbar 
                profile={{ ...user, userType: 'user' }} 
                onProfileClick={handleUserProfileClick} 
              />
              <UserJobDetail 
                user={user} 
              />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/company" element={<Navigate to="/dashboard" replace />} />
        <Route path="/user-dashboard" element={<Navigate to="/user" replace />} />
      </Routes>
    </div>
  );
}

export default App;