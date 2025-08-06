import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/ui/Button";
import { Input, Textarea, Select, Label } from "../common/ui/Input";
import { Card } from "../common/ui/Card";
import { ArrowLeft, User, Upload, X, Save, Edit, LogOut } from "lucide-react";

export function UserProfile({ user, setUser, onProfileUpdate }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    bio: "",
    experience: "",
    employmentStatus: "Looking for opportunities",
    skills: [],
    expectedSalary: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setFetching(true);
    setShowContent(false);
    try {
      const response = await fetch("/api/profile/user", {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        const profileData = data.profile || data;
        setFormData({
          firstName: profileData?.firstName || "",
          lastName: profileData?.lastName || "",
          email: profileData?.email || "",
          phone: profileData?.phone || "",
          location: profileData?.location || "",
          headline: profileData?.headline || "",
          bio: profileData?.bio || "",
          experience: profileData?.experience || "",
          employmentStatus: profileData?.employmentStatus || "Looking for opportunities",
          skills: profileData?.skills || [],
          expectedSalary: profileData?.expectedSalary || "",
          avatar: profileData?.avatar || null,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile data");
    } finally {
      setFetching(false);
      setTimeout(() => setShowContent(true), 200);
    }
  };

  useEffect(() => {
    if (!fetching && !showContent) {
      const t = setTimeout(() => setShowContent(true), 200);
      return () => { clearTimeout(t); };
    }
  }, [fetching, showContent]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/auth/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        
        // Update user data with the returned profile data
        const updatedUserData = data.profile || data;
        setUser(prev => ({
          ...prev,
          ...updatedUserData,
          // Ensure avatar is included in the update
          avatar: updatedUserData.avatar || prev.avatar
        }));
        
        // Also update the global user state in App.jsx by triggering a refresh
        // This ensures the UserDashboard shows the updated name
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative z-20 w-full h-full p-4 sm:p-8">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          {/* Web/Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="sleek" onClick={() => navigate("/user")} className="flex items-center gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="sleek" onClick={() => setIsEditing(false)} className="flex items-center gap-2">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between px-6 py-2 gap-2 shadow-lg">
          <Button
            variant="sleek"
            onClick={() => navigate("/user")}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="sleek"
                onClick={() => setIsEditing(false)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
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
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" required>
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      required
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      className="bg-gray-100 dark:bg-gray-700"
                      disabled
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State/Country"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => handleInputChange("headline", e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="e.g., 5 years"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => handleInputChange("employmentStatus", value)}
                      options={[
                        { value: "Looking for opportunities", label: "Looking for opportunities" },
                        { value: "Open to opportunities", label: "Open to opportunities" },
                        { value: "Not looking", label: "Not looking" }
                      ]}
                      placeholder="Select status"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectedSalary">Expected Salary</Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    value={formData.expectedSalary}
                    onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                    placeholder="e.g., 80000"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
              <div className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill} size="sm" className="flex items-center gap-1">
                      Add
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">{skill}</span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Upload */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h2>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  {formData.avatar ? (
                    <div className="relative">
                      <img
                        src={formData.avatar}
                        alt="Profile Picture"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                      {isEditing && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleInputChange("avatar", null)}
                          className="absolute -top-2 -right-2 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div>
                    <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => document.getElementById("avatar-upload").click()}
                      className="flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recommended: Square image, max 2MB
                </p>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={`${formData.firstName} ${formData.lastName}`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {formData.firstName} {formData.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.headline}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{formData.bio}</p>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>📍 {formData.location}</p>
                  <p>💼 {formData.employmentStatus}</p>
                  <p>🎯 {formData.experience} experience</p>
                  {formData.expectedSalary && <p>💰 ${formData.expectedSalary}</p>}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}