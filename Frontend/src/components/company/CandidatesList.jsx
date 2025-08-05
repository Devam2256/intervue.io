// CandidatesList: Lists all candidates for a job
import { Card, CardContent, CardHeader, CardTitle } from "../common/ui/Card.jsx"
import { Users } from "lucide-react"
import { CandidateCard } from "./CandidateCard"

export function CandidatesList({ candidates }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Candidates ({candidates.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} isLast={index === candidates.length - 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No candidates yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Candidates who apply for this position will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}