// CandidateCard: Displays a candidate's info and actions for a job
import { useState } from "react"
import { Button } from "../common/ui/Button.jsx"
import { Badge } from "../common/ui/Badge.jsx"
import { Avatar, AvatarFallback } from "../common/ui/Avatar.jsx"
import { Separator } from "../common/ui/Separator.jsx"
import { Download, Calendar, X } from "lucide-react"

export function CandidateCard({ candidate, isLast }) {
  const [status, setStatus] = useState("Applied")

  const handleSchedule = () => {
    setStatus("Interview Scheduled")
  }

  const handleReject = () => {
    setStatus("Rejected")
  }

  const getStatusBadge = () => {
    switch (status) {
      case "Interview Scheduled":
        return <Badge variant="success">Interview Scheduled</Badge>
      case "Rejected":
        return <Badge variant="danger">Rejected</Badge>
      default:
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSchedule} className="flex items-center gap-1 cursor-pointer">
              <Calendar className="h-3 w-3" />
              Schedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              className="flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600 bg-transparent"
            >
              <X className="h-3 w-3" />
              <span onClick={handleReject} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer">Reject</span>
            </Button>
          </div>
        )
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Avatar>
            <AvatarFallback>
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{candidate.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.experience} experience</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {candidate.skills.slice(0, 3).map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{candidate.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto mt-3 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-transparent w-full sm:w-auto"
            onClick={() => window.open(candidate.resumeUrl, "_blank")}
          >
            <Download className="h-3 w-3" />
            <span onClick={() => window.open(candidate.resumeUrl, "_blank")} className="text-blue-600 hover:underline cursor-pointer">View Resume</span>
          </Button>
          {getStatusBadge()}
        </div>
      </div>
      {!isLast && <Separator className="my-4" />}
    </>
  )
}