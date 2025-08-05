import { useState, useRef, useEffect } from "react";
import { Button } from "../common/ui/Button";
import { User, Menu } from "lucide-react";
import ShinyText from "../common/ui/ShinyText";

export function SleekNavbar({ profile, onProfileClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <nav className="w-full flex items-center justify-between px-2 sm:px-8 py-2 bg-transparent border-b border-gray-800/30 backdrop-blur-md z-50 relative">
      <div className="flex items-center gap-2">
        <ShinyText text="Intervue.io" disabled={false} speed={1} className="text-lg sm:text-2xl font-bold" />
      </div>
      {/* Desktop icons */}
      <div className="hidden sm:flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onProfileClick} className="relative p-2 sm:p-2.5">
          {profile?.logo ? (
            <img
              src={profile.logo || "/placeholder.svg"}
              alt={profile.companyName}
              className="w-6 h-6 sm:w-5 sm:h-5 rounded object-cover"
            />
          ) : (
            <User className="h-5 w-5 sm:h-4 sm:w-4" />
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
            {profile?.logo ? (
              <img
                src={profile.logo || "/placeholder.svg"}
                alt={profile.companyName}
                className="w-6 h-6 rounded object-cover mr-2"
              />
            ) : (
              <User className="h-5 w-5 mr-2" />
            )}
            <span>Profile</span>
          </Button>
        </div>
      )}
    </nav>
  );
}