import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../common/ui/Button.jsx"
import { Card } from "../common/ui/Card.jsx"
import { Badge } from "../common/ui/Badge.jsx"
import { CandidatesList } from "./CandidatesList"
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
  Phone
} from "lucide-react"
// Removed mock data import - now using real API data
import { JobDetailPageSkeleton } from "../common/ui/Shimmer.jsx"
import { CreateJobForm } from "./CreateJobForm";

// JobDetail: Shows job details, company info, and candidate list
export function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  // Animation states for staggered loading
  const [showHeader, setShowHeader] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);

  useEffect(() => {
    setShowHeader(false);
    setShowMain(false);
    setShowCandidates(false);
    setLoading(true);
    
    // Fetch job data from API
    const fetchJobData = async () => {
      try {
        const [jobResponse, candidatesResponse] = await Promise.all([
          fetch(`/api/jobs/${id}`),
          fetch(`/api/candidates/job/${id}`)
        ]);
        
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJob(jobData);
        }
        
        if (candidatesResponse.ok) {
          const candidatesData = await candidatesResponse.json();
          setCandidates(candidatesData);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [id])

  useEffect(() => {
    if (!loading) {
      const t1 = setTimeout(() => setShowHeader(true), 100);
      const t2 = setTimeout(() => setShowMain(true), 250);
      const t4 = setTimeout(() => setShowCandidates(true), 600);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t4); };
    }
  }, [loading]);

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedCandidate = await response.json();
        setCandidates((prev) =>
          prev.map((candidate) => (candidate._id === candidateId ? updatedCandidate : candidate))
        );
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  }

  // Handler to close the job
  const handleCloseJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Closed' })
      });
      
      if (response.ok) {
        const updatedJob = await response.json();
        setJob(updatedJob);
      }
    } catch (error) {
      console.error('Error closing job:', error);
    }
  };

  if (loading) {
    return <JobDetailPageSkeleton />
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
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
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header with Back Button and Actions */}
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 transition-all duration-700 ease-out ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button variant="sleek" onClick={() => navigate("/")} className="flex items-center gap-2 -ml-2 self-start">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Jobs</span>
            <span className="sm:hidden">Back</span>
          </Button>
          {/* Removed Share, Save, and Edit Job buttons from header */}
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out ${showMain ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                        {job.title}
                      </h1>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="text-sm sm:text-base">{job.locationString || job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span className="text-sm sm:text-base">{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span className="text-sm sm:text-base">
                            {job.formattedSalary || job.salary || "Not specified"}
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
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
                    Job Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
                      Requirements
                    </h3>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="default" size="md">
                          {typeof skill === "string" ? skill : skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-base sm:text-lg">Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">About the Company</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* Assuming profile data is available or will be fetched */}
                  {/* For now, using placeholder or mock data */}
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Company Name</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Industry</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Company description placeholder.</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    <Users className="h-4 w-4" />
                    <span>Company Size</span>
                  </div>
                  {/* Assuming profile data is available or will be fetched */}
                  {/* For now, using placeholder or mock data */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                      <Globe className="h-4 w-4" />
                      <a
                      href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                      Website
                      </a>
                    </div>
                  {/* Assuming profile data is available or will be fetched */}
                  {/* For now, using placeholder or mock data */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                      <Mail className="h-4 w-4" />
                    <a href="mailto:info@example.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Email
                      </a>
                    </div>
                  {/* Assuming profile data is available or will be fetched */}
                  {/* For now, using placeholder or mock data */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                      <Phone className="h-4 w-4" />
                    <a href="tel:+1234567890" className="hover:text-blue-600 dark:hover:text-blue-400">
                      Phone
                      </a>
                    </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="primary" fullWidth className="justify-center" onClick={() => navigate(`/company/jobs/${id}/edit`)}>
                  Edit Job Posting
                </Button>
                <Button variant="danger" fullWidth className="justify-center" onClick={handleCloseJob} disabled={job.status === "Closed"}>
                  Close Job
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Candidates Section */}
        <div className={`mt-8 transition-all duration-700 ease-out ${showCandidates ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CandidatesList candidates={candidates} onStatusUpdate={handleStatusUpdate} />
        </div>

        {/* Edit Job Page is now handled by routing */}
      </div>
    </div>
  )
}