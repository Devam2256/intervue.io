// Shimmer: Skeleton loading components for dashboard and job detail
import { Card } from "./Card.jsx"

export function Shimmer({ className = "" }) {
    return (
      <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    )
  }
  
  export function JobCardSkeleton() {
    return (
      <Card noBorder className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div className="flex-1 space-y-2 w-full">
            <Shimmer className="h-6 w-3/4" />
            <Shimmer className="h-4 w-1/2" />
          </div>
          <Shimmer className="h-6 w-16 mt-2 sm:mt-0" />
        </div>
  
        <Shimmer className="h-16 w-full" />
  
        <div className="flex flex-wrap gap-2">
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-6 w-20" />
          <Shimmer className="h-6 w-14" />
        </div>
  
        <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-2 sm:gap-0">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-20" />
        </div>
      </Card>
    )
  }
  
  export function StatsCardSkeleton() {
    return (
      <Card noBorder className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 space-y-2 sm:space-y-4 w-full">
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-4 w-4" />
        </div>
        <Shimmer className="h-6 sm:h-8 w-12" />
        <Shimmer className="h-3 w-16" />
      </Card>
    )
  }
  
  export function JobDetailSkeleton() {
    return (
      <Card noBorder className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        {/* Title */}
        <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
        {/* Stats */}
        <div className="flex gap-4">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        {/* Description/Requirements */}
        <div className="space-y-3 mt-6">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </Card>
    )
  }
  
  export function CandidateCardSkeleton() {
    return (
      <Card noBorder className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 w-full">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" /> {/* Name */}
            <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700" /> {/* Email */}
            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" /> {/* Experience */}
            <div className="flex gap-1 mt-1">
              <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </Card>
    )
  }
  
  export function ProfileSetupSkeleton() {
    return (
      <Card noBorder className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div>
              <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
              <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-32 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </Card>
    )
  }

export function CompanyDashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shimmer className="h-8 w-8 rounded-lg" />
              <Shimmer className="h-8 w-48 rounded" />
            </div>
            <Shimmer className="h-4 w-64 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Shimmer className="h-10 w-10 rounded" />
          </div>
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="p-3 sm:p-6 w-full">
              <Shimmer className="h-4 w-20 mb-2" />
              <Shimmer className="h-6 w-12 mb-1" />
            </Card>
          ))}
        </div>
        {/* Search and Create Job Skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <div className="relative flex-1 w-full">
            <Shimmer className="absolute left-3 top-1/2 h-4 w-4 rounded" />
            <Shimmer className="h-10 w-full rounded pl-10" />
          </div>
          <Shimmer className="h-10 w-40 rounded w-full sm:w-40" />
        </div>
        {/* Category Filters Skeleton */}
        <div className="flex flex-wrap gap-2 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="h-8 w-20 rounded" />
          ))}
        </div>
        {/* Jobs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {Array.from({ length: 2 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function JobDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Shimmer className="h-10 w-40 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="space-y-4 sm:space-y-6">
                {/* Title and Meta */}
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <Shimmer className="h-8 w-2/3 rounded mb-3" />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                        <Shimmer className="h-4 w-24 rounded" />
                        <Shimmer className="h-4 w-20 rounded" />
                        <Shimmer className="h-4 w-28 rounded" />
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3 lg:gap-2">
                      <Shimmer className="h-6 w-20 rounded" />
                      <Shimmer className="h-6 w-16 rounded" />
                      <Shimmer className="h-6 w-16 rounded" />
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center gap-4 sm:gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Shimmer className="h-4 w-28 rounded" />
                    <Shimmer className="h-4 w-32 rounded" />
                  </div>
                </div>
                {/* Description */}
                <div>
                  <Shimmer className="h-5 w-40 rounded mb-3" />
                  <Shimmer className="h-4 w-full rounded mb-1" />
                  <Shimmer className="h-4 w-5/6 rounded mb-1" />
                  <Shimmer className="h-4 w-2/3 rounded" />
                </div>
                {/* Requirements */}
                <div>
                  <Shimmer className="h-5 w-32 rounded mb-3" />
                  <Shimmer className="h-4 w-1/2 rounded mb-1" />
                  <Shimmer className="h-4 w-2/3 rounded mb-1" />
                  <Shimmer className="h-4 w-1/3 rounded" />
                </div>
                {/* Skills */}
                <div>
                  <Shimmer className="h-5 w-32 rounded mb-3" />
                  <div className="flex flex-wrap gap-2">
                    <Shimmer className="h-6 w-16 rounded" />
                    <Shimmer className="h-6 w-20 rounded" />
                    <Shimmer className="h-6 w-14 rounded" />
                  </div>
                </div>
                {/* Benefits */}
                <div>
                  <Shimmer className="h-5 w-32 rounded mb-3" />
                  <Shimmer className="h-4 w-1/2 rounded mb-1" />
                  <Shimmer className="h-4 w-2/3 rounded mb-1" />
                  <Shimmer className="h-4 w-1/3 rounded" />
                </div>
              </div>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Shimmer className="h-6 w-32 mb-4 rounded" />
              <div className="flex items-center gap-3 mb-4">
                <Shimmer className="h-12 w-12 rounded-lg" />
                <div>
                  <Shimmer className="h-4 w-24 mb-2 rounded" />
                  <Shimmer className="h-3 w-20 rounded" />
                </div>
              </div>
              <Shimmer className="h-4 w-40 mb-2 rounded" />
              <Shimmer className="h-4 w-32 mb-2 rounded" />
              <Shimmer className="h-4 w-24 mb-2 rounded" />
              <Shimmer className="h-4 w-28 mb-2 rounded" />
            </Card>
            {/* Quick Actions Card */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Shimmer className="h-6 w-32 mb-4 rounded" />
              <Shimmer className="h-10 w-full mb-3 rounded" />
              <Shimmer className="h-10 w-full rounded" />
            </Card>
          </div>
        </div>
        {/* Candidates Section */}
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 flex items-center gap-4">
              <Shimmer className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-32 rounded" />
                <Shimmer className="h-3 w-40 rounded" />
                <Shimmer className="h-3 w-28 rounded" />
                <div className="flex gap-1 mt-1">
                  <Shimmer className="h-5 w-20 rounded" />
                  <Shimmer className="h-5 w-20 rounded" />
                  <Shimmer className="h-5 w-16 rounded" />
                  <Shimmer className="h-5 w-12 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <Shimmer className="h-8 w-20 rounded" />
                <Shimmer className="h-8 w-20 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// User dashboard skeleton
export function UserDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// User job detail skeleton
export function UserJobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="container mx-auto p-4 sm:p-6">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}