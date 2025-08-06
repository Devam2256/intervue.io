// JobCard: Displays a summary of a job posting with actions
import { Card } from "../common/ui/Card.jsx"
import { Badge } from "../common/ui/Badge.jsx"
import { MapPin, Clock, DollarSign, Users, Calendar, AlertCircle, Building } from "lucide-react"

export function JobCard({ job, company, onClick }) {
  // Debug company data
  console.log('JobCard - Received company data:', company);
  console.log('JobCard - Company logo:', company?.logo);
  console.log('JobCard - Company name:', company?.name);
  console.log('JobCard - Company industry:', company?.industry);
  console.log('JobCard - Company ID:', company?._id);

  const handleClick = () => {
    onClick(job)
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

  // Helper function to check if a field is empty or missing
  const isFieldEmpty = (field) => {
    if (!field) return true
    if (Array.isArray(field)) return field.length === 0 || (field.length === 1 && field[0] === "")
    if (typeof field === "string") return field.trim() === ""
    return false
  }

  // Helper function to render field with fallback message
  const renderField = (field, fallbackMessage, icon = null) => {
    if (isFieldEmpty(field)) {
      return (
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
          {icon && <AlertCircle className="h-3 w-3" />}
          <span className="italic">{fallbackMessage}</span>
        </div>
      )
    }
    return null
  }

  return (
    <Card onClick={handleClick} hover={true} className="p-4 sm:p-6 space-y-4 animate-fade-in bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
      {/* Company Header */}
      {company && (
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name || "Company Logo"}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              onError={(e) => {
                console.error('JobCard - Company logo failed to load:', company.logo);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <Building className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {company.name || "Company Name"}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {company.industry || "Industry"}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg leading-tight mb-2 truncate">
            {job.title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">{job.locationString || job.location}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span>{job.type}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge variant={getStatusColor(job.status)} size="sm">
            {job.status}
          </Badge>
          {job.priority && (
            <Badge variant={getPriorityColor(job.priority)} size="sm">
              {job.priority}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {job.description}
        </p>
        {renderField(job.description, "No description available", AlertCircle)}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-gray-900 dark:text-white">
              {job.salary || "Salary not specified"}
            </span>
          </div>
          {renderField(job.salary, "Salary not specified", AlertCircle)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span className="font-medium text-gray-900 dark:text-white">
              {job.category || "Category not specified"}
            </span>
          </div>
          {renderField(job.category, "Category not specified", AlertCircle)}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Required Skills</h4>
        {job.skills && job.skills.length > 0 && job.skills.some(skill => skill && skill.trim() !== "") ? (
          <div className="flex flex-wrap gap-1">
            {job.skills.filter(skill => skill && skill.trim() !== "").slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
            {job.skills.filter(skill => skill && skill.trim() !== "").length > 3 && (
              <Badge variant="secondary" size="sm">
                +{job.skills.filter(skill => skill && skill.trim() !== "").length - 3} more
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <AlertCircle className="h-3 w-3" />
            <span className="italic">Not Mentioned</span>
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Requirements</h4>
        {job.requirements && job.requirements.length > 0 && job.requirements.some(req => req && req.trim() !== "") ? (
          <div className="flex flex-wrap gap-1">
            {job.requirements.filter(req => req && req.trim() !== "").slice(0, 2).map((req, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {req}
              </Badge>
            ))}
            {job.requirements.filter(req => req && req.trim() !== "").length > 2 && (
              <Badge variant="secondary" size="sm">
                +{job.requirements.filter(req => req && req.trim() !== "").length - 2} more
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <AlertCircle className="h-3 w-3" />
            <span className="italic">Not Mentioned</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Benefits</h4>
        {job.benefits && job.benefits.length > 0 && job.benefits.some(benefit => benefit && benefit.trim() !== "") ? (
          <div className="flex flex-wrap gap-1">
            {job.benefits.filter(benefit => benefit && benefit.trim() !== "").slice(0, 2).map((benefit, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {benefit}
              </Badge>
            ))}
            {job.benefits.filter(benefit => benefit && benefit.trim() !== "").length > 2 && (
              <Badge variant="secondary" size="sm">
                +{job.benefits.filter(benefit => benefit && benefit.trim() !== "").length - 2} more
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <AlertCircle className="h-3 w-3" />
            <span className="italic">Not Mentioned</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>
            Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {job.applicationsCount || 0} applications
        </div>
      </div>
    </Card>
  )
}