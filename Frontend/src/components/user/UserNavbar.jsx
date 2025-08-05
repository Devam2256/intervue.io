// UserNavbar: Navigation bar for job seekers
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../common/ui/Button"
import { Avatar } from "../common/ui/Avatar"
import { Badge } from "../common/ui/Badge"
import { 
  Search, 
  Bell, 
  User, 
  Briefcase, 
  Bookmark, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"

export function UserNavbar({ user }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleProfileClick = () => {
    navigate("/user/profile")
    setIsProfileMenuOpen(false)
  }

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    console.log("Logging out...")
    navigate("/")
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/user")}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                InterVue
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links */}
            <Button
              variant="ghost"
              onClick={() => navigate("/user")}
              className="text-gray-700 hover:text-blue-600"
            >
              Jobs
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/user/applications")}
              className="text-gray-700 hover:text-blue-600"
            >
              My Applications
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/user/saved")}
              className="text-gray-700 hover:text-blue-600"
            >
              Saved Jobs
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-blue-600 relative"
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="danger" 
                size="sm" 
                className="absolute -top-1 -right-1 h-4 w-4 text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Profile Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.fullName || "User"}
                  fallback={user?.firstName?.[0] || "U"}
                  size="sm"
                />
                <span className="hidden lg:block">{user?.fullName || "User"}</span>
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/user/settings")}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/user")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-gray-700"
              >
                Jobs
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/user/applications")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-gray-700"
              >
                My Applications
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/user/saved")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-gray-700"
              >
                Saved Jobs
              </Button>
              <hr className="border-gray-200" />
              <Button
                variant="ghost"
                onClick={() => {
                  handleProfileClick()
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-gray-700"
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/user/settings")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-gray-700"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-red-600"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}