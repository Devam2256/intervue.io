// ProfileSetup: Company profile setup form for onboarding
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../common/ui/Button"
import { Input, Textarea, Select, Label } from "../common/ui/Input"
import { Card } from "../common/ui/Card"
import { ArrowLeft, Building, Upload, X, Save, Sun, Moon, Plus, Trash2, Edit } from "lucide-react"

const industryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Consulting", label: "Consulting" },
  { value: "Other", label: "Other" },
]

const companySizeOptions = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-100", label: "51-100 employees" },
  { value: "101-500", label: "101-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
]

export function ProfileSetup() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    location: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    founded: "",
    logo: null,
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
    },
    benefits: [],
  })
  const [newBenefit, setNewBenefit] = useState("")

  // Fetch existing profile data on component mount
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    setFetching(true)
    try {
      // Simulate API call to fetch existing profile
      const response = await fetch("/api/company/profile")
      if (response.ok) {
        const profileData = await response.json()
        setFormData({
          companyName: profileData.companyName || "",
          industry: profileData.industry || "",
          companySize: profileData.companySize || "",
          location: profileData.location || "",
          description: profileData.description || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          website: profileData.website || "",
          founded: profileData.founded || "",
          logo: profileData.logo || null,
          socialLinks: {
            linkedin: profileData.socialLinks?.linkedin || "",
            twitter: profileData.socialLinks?.twitter || "",
            facebook: profileData.socialLinks?.facebook || "",
          },
          benefits: profileData.benefits || [],
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setFetching(false)
    }
  }

  // Validation functions
  const validateCompanyName = (value) => {
    if (value && !/^[a-zA-Z0-9\s\-_&.]+$/.test(value)) {
      return "Company name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, and periods";
    }
    return "";
  };

  const validateLocation = (value) => {
    if (value && !/^[a-zA-Z0-9\s\-_,]+$/.test(value)) {
      return "Location can only contain letters, numbers, spaces, hyphens, underscores, and commas";
    }
    return "";
  };

  const validatePhone = (value) => {
    if (value && !/^[0-9\s\-()+]+$/.test(value)) {
      return "Phone can only contain numbers, spaces, hyphens, parentheses, and plus signs";
    }
    return "";
  };

  const validateWebsite = (value) => {
    if (value && !/^https?:\/\/.+/.test(value)) {
      return "Website must be a valid URL starting with http:// or https://";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateBenefit = (value) => {
    if (value && !/^[a-zA-Z0-9\s\-_.,]+$/.test(value)) {
      return "Benefits can only contain letters, numbers, spaces, hyphens, underscores, commas, and periods";
    }
    return "";
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

  // Function to validate field on blur
  const handleFieldBlur = (field, value) => {
    let error = "";
    
    switch (field) {
      case "companyName":
        error = validateCompanyName(value);
        break;
      case "location":
        error = validateLocation(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "website":
        error = validateWebsite(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));

    // Clear field error when user starts typing
    const fieldKey = `socialLinks_${platform}`;
    if (fieldErrors[fieldKey]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldKey]: ""
      }));
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      // Validate benefit before adding
      const benefitError = validateBenefit(newBenefit.trim());
      if (benefitError) {
        setFieldErrors(prev => ({
          ...prev,
          newBenefit: benefitError
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
      
      // Clear error
      setFieldErrors(prev => ({
        ...prev,
        newBenefit: ""
      }));
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          logo: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // Validate all fields before saving
    const errors = {};
    
    // Validate company name
    const companyNameError = validateCompanyName(formData.companyName);
    if (companyNameError) errors.companyName = companyNameError;
    
    // Validate location
    const locationError = validateLocation(formData.location);
    if (locationError) errors.location = locationError;
    
    // Validate phone
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    // Validate website
    const websiteError = validateWebsite(formData.website);
    if (websiteError) errors.website = websiteError;
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // If there are validation errors, don't save
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Save to database
      const response = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!")
        setIsEditing(false)
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed inset-0 z-10 backdrop-blur-md bg-black/10" aria-hidden="true"></div>
      <div className="relative z-20 w-full h-full p-4 sm:p-8">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          {/* Web/Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="sleek" onClick={() => navigate("/")} className="flex items-center gap-2 -ml-2">
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
          </div>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between px-6 py-2 gap-2 shadow-lg">
          <Button
            variant="sleek"
            onClick={() => navigate("/")}
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
                <div>
                  <Label htmlFor="companyName" required>
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    onBlur={(e) => handleFieldBlur("companyName", e.target.value)}
                    placeholder="Enter company name"
                    required
                    disabled={!isEditing}
                  />
                  {fieldErrors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.companyName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry" required>
                      Industry
                    </Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleInputChange("industry", value)}
                      options={industryOptions}
                      placeholder="Select industry"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="companySize" required>
                      Company Size
                    </Label>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) => handleInputChange("companySize", value)}
                      options={companySizeOptions}
                      placeholder="Select company size"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" required>
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    onBlur={(e) => handleFieldBlur("location", e.target.value)}
                    placeholder="City, State/Country"
                    required
                    disabled={!isEditing}
                  />
                  {fieldErrors.location && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" required>
                    Company Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Tell us about your company..."
                    rows={4}
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={(e) => handleFieldBlur("email", e.target.value)}
                      placeholder="company@example.com"
                      disabled={!isEditing}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      onBlur={(e) => handleFieldBlur("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      disabled={!isEditing}
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    onBlur={(e) => handleFieldBlur("website", e.target.value)}
                    placeholder="https://www.company.com"
                    disabled={!isEditing}
                  />
                  {fieldErrors.website && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.website}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded}
                    onChange={(e) => handleInputChange("founded", e.target.value)}
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                    onBlur={(e) => handleFieldBlur("socialLinks_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    disabled={!isEditing}
                  />
                  {fieldErrors.socialLinks_linkedin && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.socialLinks_linkedin}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    onBlur={(e) => handleFieldBlur("socialLinks_twitter", e.target.value)}
                    placeholder="https://twitter.com/yourcompany"
                    disabled={!isEditing}
                  />
                  {fieldErrors.socialLinks_twitter && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.socialLinks_twitter}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                    onBlur={(e) => handleFieldBlur("socialLinks_facebook", e.target.value)}
                    placeholder="https://facebook.com/yourcompany"
                    disabled={!isEditing}
                  />
                  {fieldErrors.socialLinks_facebook && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.socialLinks_facebook}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Benefits</h2>
              <div className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onBlur={(e) => handleFieldBlur("newBenefit", e.target.value)}
                      placeholder="Add a benefit..."
                      onKeyPress={(e) => e.key === "Enter" && handleAddBenefit()}
                    />
                    <Button onClick={handleAddBenefit} size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )}
                {fieldErrors.newBenefit && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.newBenefit}</p>
                )}

                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">{benefit}</span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBenefit(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
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
            {/* Logo Upload */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Logo</h2>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  {formData.logo ? (
                    <div className="relative">
                      <img
                        src={formData.logo || "/placeholder.svg"}
                        alt="Company Logo"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                      {isEditing && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleInputChange("logo", null)}
                          className="absolute -top-2 -right-2 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <Building className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div>
                    <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => document.getElementById("logo-upload").click()}
                      className="flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
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
                  {formData.logo ? (
                    <img
                      src={formData.logo || "/placeholder.svg"}
                      alt={formData.companyName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{formData.companyName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formData.industry}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{formData.description}</p>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>📍 {formData.location}</p>
                  <p>👥 {formData.companySize} employees</p>
                  {formData.founded && <p>📅 Founded in {formData.founded}</p>}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}