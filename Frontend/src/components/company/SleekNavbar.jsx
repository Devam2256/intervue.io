import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/ui/Button";
import { User, Menu, LogOut } from "lucide-react";
import ShinyText from "../common/ui/ShinyText";

export function SleekNavbar({ profile, onProfileClick }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogoClick = () => {
    // Navigate to appropriate dashboard based on user type
    if (profile?.userType === 'user') {
      navigate('/user');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Clear any local state and redirect to login
        navigate('/auth/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-2 sm:px-8 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 relative">
      <div className="flex items-center gap-2">
        <button onClick={handleLogoClick} className="cursor-pointer">
          <ShinyText text="Intervue.io" disabled={false} speed={1} className="text-lg sm:text-2xl font-bold" />
        </button>
      </div>
      {/* Desktop icons */}
      <div className="hidden sm:flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onProfileClick} className="relative p-2 sm:p-2.5">
          {profile?.userType === 'user' ? (
            // Show user avatar for user profiles
            profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-6 h-6 sm:w-5 sm:h-5 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 sm:h-4 sm:w-4" />
            )
          ) : (
            // Show company logo for company profiles
            profile?.logo ? (
              <img
                src={profile.logo || "/placeholder.svg"}
                alt={profile.name}
                className="w-6 h-6 sm:w-5 sm:h-5 rounded object-cover"
              />
            ) : (
              <User className="h-5 w-5 sm:h-4 sm:w-4" />
            )
          )}
        </Button>
      </div>
      {/* Mobile hamburger */}
      <div className="flex sm:hidden items-center gap-1">
        <Button ref={menuButtonRef} variant="outline" size="icon" onClick={() => setMobileMenuOpen((v) => !v)} className="p-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-12 z-50 min-w-[160px] max-w-[90vw] bg-[#fff] border border-[#e5e7eb] rounded-lg shadow-lg transition-all duration-300 ease-out opacity-100 translate-y-0 animate-dropdown-fade-slide overflow-hidden"
        >
          <Button variant="outline" size="icon" onClick={() => { setMobileMenuOpen(false); onProfileClick(); }} className="w-full flex items-center justify-start gap-2 px-4 py-2 hover:bg-[#f1f5f9] focus:bg-[#f1f5f9]">
            {profile?.userType === 'user' ? (
              // Show user avatar for user profiles
              profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )
            ) : (
              // Show company logo for company profiles
              profile?.logo ? (
                <img
                  src={profile.logo || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-6 h-6 rounded object-cover mr-2"
                />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )
            )}
            <span>Profile</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-start gap-2 px-4 py-2 hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      )}
    </nav>
  );
}