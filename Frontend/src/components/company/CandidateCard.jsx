// CandidateCard: Displays a candidate's info and actions for a job
import { useState } from "react"
import { Button } from "../common/ui/Button.jsx"
import { Badge } from "../common/ui/Badge.jsx"
import { Avatar, AvatarFallback } from "../common/ui/Avatar.jsx"
import { Separator } from "../common/ui/Separator.jsx"
import { Download, Calendar, X, CheckCircle, Video, Link } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function CandidateCard({ candidate, isLast, onStatusUpdate }) {
  const [loading, setLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [meetLink, setMeetLink] = useState("")
  const [interviewType, setInterviewType] = useState("google-meet") // "google-meet" or "video-call"
  const navigate = useNavigate()

  const handleSchedule = async () => {
    if (interviewType === "google-meet" && !meetLink.trim()) {
      alert("Please enter a Google Meet link");
      return;
    }

    setLoading(true);
    try {
      let meetLinkToSend = meetLink;
      
      if (interviewType === "video-call") {
        // Generate a room ID for video call
        const randomId = Math.random().toString(36).substring(2, 9);
        const timestamp = Date.now().toString().substring(-4);
        const roomId = randomId + timestamp;
        meetLinkToSend = `${window.location.origin}/room/${roomId}?type=one-on-one`;
      }

      const response = await fetch(`/api/candidates/${candidate._id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          meetLink: meetLinkToSend,
          interviewType: interviewType
        })
      });

      if (response.ok) {
        const updatedCandidate = await response.json();
        onStatusUpdate(updatedCandidate);
        setShowScheduleModal(false);
        setMeetLink("");
        setInterviewType("google-meet");
        
        // If it's a video call, navigate to the room
        if (interviewType === "video-call") {
          const roomId = meetLinkToSend.split('/room/')[1].split('?')[0];
          navigate(`/room/${roomId}?type=one-on-one`);
        }
      } else {
        throw new Error('Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this candidate?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/candidates/${candidate._id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const updatedCandidate = await response.json();
        onStatusUpdate(updatedCandidate);
      } else {
        throw new Error('Failed to reject candidate');
      }
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      alert('Failed to reject candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = async () => {
    if (!window.confirm('Are you sure you want to accept this candidate?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/candidates/${candidate._id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const updatedCandidate = await response.json();
        onStatusUpdate(updatedCandidate);
      } else {
        throw new Error('Failed to accept candidate');
      }
    } catch (error) {
      console.error('Error accepting candidate:', error);
      alert('Failed to accept candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = () => {
    switch (candidate.status) {
      case "Scheduled":
        return (
          <div className="flex gap-2">
            <Badge variant="success">Interview Scheduled</Badge>
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={loading}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-3 w-3" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600 bg-transparent"
            >
              <X className="h-3 w-3" />
              <span className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Reject</span>
            </Button>
          </div>
        )
      case "Accepted":
        return <Badge variant="success">Accepted</Badge>
      case "Rejected":
        return <Badge variant="danger">Rejected</Badge>
      default:
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => setShowScheduleModal(true)} 
              disabled={loading}
              className="flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="h-3 w-3" />
              Schedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600 bg-transparent"
            >
              <X className="h-3 w-3" />
              <span className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Reject</span>
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
          {candidate.resume && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent w-full sm:w-auto"
              onClick={() => window.open(candidate.resume, "_blank")}
            >
              <Download className="h-3 w-3" />
              <span className="text-blue-600 hover:underline cursor-pointer">View Resume</span>
            </Button>
          )}
          {getStatusBadge()}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Schedule Interview
            </h3>
            <div className="space-y-4">
              {/* Interview Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Type
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interviewType"
                      value="google-meet"
                      checked={interviewType === "google-meet"}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Link className="h-4 w-4" />
                    <span className="text-sm">Google Meet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interviewType"
                      value="video-call"
                      checked={interviewType === "video-call"}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Video className="h-4 w-4" />
                    <span className="text-sm">Video Call</span>
                  </label>
                </div>
              </div>

              {/* Google Meet Link Input (only show if Google Meet is selected) */}
              {interviewType === "google-meet" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Meet Link
                  </label>
                  <input
                    type="url"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Video Call Info (only show if Video Call is selected) */}
              {interviewType === "video-call" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    A video call room will be automatically generated and shared with the candidate.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setMeetLink("");
                    setInterviewType("google-meet");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSchedule}
                  disabled={loading || (interviewType === "google-meet" && !meetLink.trim())}
                >
                  {loading ? "Scheduling..." : "Schedule Interview"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLast && <Separator className="my-4" />}
    </>
  )
}