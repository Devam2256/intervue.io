import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";

export function UserProfile({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setFetching(true);
    setShowContent(false); // Reset showContent when fetching starts
    try {
      // Changed from /api/user/profile to /api/profile/user
      const response = await fetch("/api/profile/user");
      const data = await response.json();
      
      if (response.ok) {
        // Updated to handle the profile property in the response
        const profileData = data.profile || data;
        setFormData({
          firstName: profileData?.firstName || "",
          lastName: profileData?.lastName || "",
          email: profileData?.email || "",
          phone: profileData?.phone || "",
          location: profileData?.location || "",
          headline: profileData?.headline || "",
          bio: profileData?.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile data");
    } finally {
      setFetching(false);
      // Set showContent to true here directly instead of relying on useEffect
      setTimeout(() => setShowContent(true), 200);
    }
  };

  // Keep this useEffect as a backup, but add a check to avoid duplicate setting
  useEffect(() => {
    if (!fetching && !showContent) {
      const t = setTimeout(() => setShowContent(true), 200);
      return () => { clearTimeout(t); };
    }
  }, [fetching, showContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Changed from /api/user/profile to /api/profile/user
      const response = await fetch("/api/profile/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Add this to include cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/user/dashboard"); // Redirect to dashboard after success
        }, 2000);
        
        // Update user data - use profile property if it exists
        setUser(prev => ({
          ...prev,
          ...(data.profile || data), // Use the returned data from the server
        }));
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar user={user} />
      
      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                disabled={!isEditing}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}