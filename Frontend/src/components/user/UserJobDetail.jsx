// UserJobDetail: Job detail page for job seekers to view and apply for jobs
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../common/ui/Button.jsx"
import { Card } from "../common/ui/Card.jsx"
import { Badge } from "../common/ui/Badge.jsx"
import { Input, Textarea, Label } from "../common/ui/Input"
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Building,
  Globe,
  Mail,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react"
import { UserJobDetailSkeleton } from "../common/ui/Shimmer.jsx"

// Update the component props to remove theme-related props
export function UserJobDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplication, setShowApplication] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  
  // Application form state
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    expectedSalary: "",
    availability: "Immediately",
    source: "Website"
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch job and company data
  useEffect(() => {
    setLoading(true);
    
    const fetchJobData = async () => {
      try {
        const jobResponse = await fetch(`/api/jobs/${id}`, {
          credentials: 'include'
        });
        
                            if (jobResponse.ok) {
                      const jobData = await jobResponse.json();
                      console.log('UserJobDetail - Job data:', jobData);
                      console.log('UserJobDetail - Company data:', jobData.company_id);
                      setJob(jobData);
                      
                      // Use the populated company data from the job
                      if (jobData.company_id && typeof jobData.company_id === 'object') {
                        console.log('UserJobDetail - Setting company data:', jobData.company_id);
                        setCompany(jobData.company_id);
                      }
                    }
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [id]);

  // Handle application form submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job._id,
          user_id: user._id,
          company_id: job.company_id._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          experience: user.experience,
          location: user.location,
          coverLetter: applicationData.coverLetter,
          skills: user.skills,
          source: applicationData.source,
          expectedSalary: applicationData.expectedSalary,
          availability: applicationData.availability
        })
      });

      if (response.ok) {
        setApplicationSubmitted(true);
        setShowApplication(false);
        // Trigger a page refresh to update dashboard stats
        window.location.reload();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes for application form
  const handleApplicationChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <UserJobDetailSkeleton />
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Button variant="ghost" onClick={() => navigate("/user")} className="flex items-center gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Job not found</h3>
            <p className="text-gray-600 dark:text-gray-400">The job you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
      case "Urgent":
        return "danger"
      case "Low":
        return "secondary"
      default:
        return "warning"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success"
      case "Paused":
        return "warning"
      case "Closed":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="w-full px-4 sm:px-6 py-6">
        {/* Header with Back Button and Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Button variant="sleek" onClick={() => navigate("/user")} className="flex items-center gap-2 -ml-2 self-start">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Jobs</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="flex gap-2">
            {job.status === 'Active' && !applicationSubmitted && (
              <Button
                variant="primary"
                onClick={() => setShowApplication(true)}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Apply Now
              </Button>
            )}
            
            {applicationSubmitted && (
              <Button
                variant="success"
                disabled
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Applied
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <Card className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                        {job.title}
                      </h1>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="text-sm sm:text-base">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span className="text-sm sm:text-base">{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span className="text-sm sm:text-base">
                            {job.salary || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3 lg:gap-2">
                      <Badge variant="outline" className="text-sm">
                        {job.category}
                      </Badge>
                      {job.priority && job.priority !== "Medium" && (
                        <Badge variant={getPriorityColor(job.priority)} size="md">
                          {job.priority}
                        </Badge>
                      )}
                      <Badge variant={getStatusColor(job.status)} size="md">
                        {job.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.applicationsCount || 0} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-lg">
                    Job Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-lg">
                    Requirements
                  </h3>
                  {job.requirements && job.requirements.length > 0 && job.requirements.some(req => req && req.trim() !== "") ? (
                    <ul className="list-disc list-inside space-y-2">
                      {job.requirements.filter(req => req && req.trim() !== "").map((req, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {req}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Not Mentioned
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-lg">
                    Required Skills
                  </h3>
                  {job.skills && job.skills.length > 0 && job.skills.some(skill => skill && skill.trim() !== "") ? (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.filter(skill => skill && skill.trim() !== "").map((skill, index) => (
                        <Badge key={index} variant="default" size="md">
                          {typeof skill === "string" ? skill : skill.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Not Mentioned
                    </p>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-lg">Benefits</h3>
                  {job.benefits && job.benefits.length > 0 && job.benefits.some(benefit => benefit && benefit.trim() !== "") ? (
                    <ul className="list-disc list-inside space-y-2">
                      {job.benefits.filter(benefit => benefit && benefit.trim() !== "").map((benefit, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Not Mentioned
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">About the Company</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name || "Company Logo"}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {company?.name || "Company Name"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {company?.industry || "Industry"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {company?.description || "Company description not available."}
                </p>

                <div className="space-y-2 text-sm">
                  {company?.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company?.companySize && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{company.companySize} employees</span>
                    </div>
                  )}
                  {company?.website && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Globe className="h-4 w-4" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {company?.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${company.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {company.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Application Status */}
            {applicationSubmitted && (
              <Card className="p-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Application Submitted</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your application has been successfully submitted. The company will review your profile and contact you if you're selected for an interview.
                </p>
              </Card>
            )}

            {/* Job Status Warning */}
            {job.status === 'Closed' && (
              <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Job Closed</h3>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This job posting is no longer accepting applications.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Apply for {job.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowApplication(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      value={applicationData.coverLetter}
                      onChange={(e) => handleApplicationChange("coverLetter", e.target.value)}
                      rows={6}
                      placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedSalary">Expected Salary</Label>
                      <Input
                        id="expectedSalary"
                        value={applicationData.expectedSalary}
                        onChange={(e) => handleApplicationChange("expectedSalary", e.target.value)}
                        placeholder="e.g., $80,000 - $100,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability to Start</Label>
                      <select
                        id="availability"
                        value={applicationData.availability}
                        onChange={(e) => handleApplicationChange("availability", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="2 weeks">2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="3 months">3 months</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplication(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}