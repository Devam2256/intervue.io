// JobCard: Displays a summary of a job posting with actions
import { Card } from "../common/ui/Card.jsx"
import { Badge } from "../common/ui/Badge.jsx"
import { MapPin, Clock, DollarSign, Users, Calendar, AlertCircle } from "lucide-react"

export function JobCard({ job, onClick }) {
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
        <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full sm:w-auto">
          <div className="flex flex-wrap gap-1 justify-end w-full">
            <Badge variant="outline" size="sm" className="max-w-full truncate">
              {job.category}
            </Badge>
            {job.priority && job.priority !== "Medium" && (
              <Badge variant={getPriorityColor(job.priority)} size="sm" className="max-w-full truncate">
                {job.priority}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 break-words">
        {job.description}
      </p>

      {/* Requirements - Show message if missing */}
      {renderField(job.requirements, "Requirements not specified", <AlertCircle className="h-3 w-3" />)}

      {/* Skills/Tags */}
      {job.skills && job.skills.length > 0 && !isFieldEmpty(job.skills) ? (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" size="sm" className="text-xs max-w-full truncate">
              {typeof skill === "string" ? skill : skill.name}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" size="sm" className="text-xs max-w-full truncate">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      ) : (
        renderField(job.skills, "Skills not specified", <AlertCircle className="h-3 w-3" />)
      )}

      {/* Benefits - Show message if missing */}
      {renderField(job.benefits, "Benefits not specified", <AlertCircle className="h-3 w-3" />)}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex-wrap">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-1 min-w-0">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">
              {job.formattedSalary || job.salary || "Salary not specified"}
            </span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{job.applicationsCount || 0} applicants</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 min-w-0">
            <Calendar className="h-3 w-3" />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <Badge variant={getStatusColor(job.status)} size="sm" className="max-w-full truncate">
            {job.status}
          </Badge>
        </div>
      </div>
    </Card>
  )
}