// CompanyDashboard: Main dashboard for managing jobs, stats, and filters
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SleekNavbar } from "./SleekNavbar";
import { JobCard } from "./JobCard"
import { CreateJobForm } from "./CreateJobForm"
import { JobCardSkeleton, CompanyDashboardSkeleton } from "../common/ui/Shimmer"
import { Search } from "lucide-react"
// Removed mock data import - now using real API data
import { Input } from "../common/ui/Input"
import { Button } from "../common/ui/Button"
import { Plus } from "lucide-react"
import { Navbar } from "./Navbar";

export function CompanyDashboard({ profile }) {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  // Animation state for staggered loading
  const [showJobs, setShowJobs] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    avgApplicationsPerJob: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    setShowJobs(false);
    setLoading(true);
    setStatsLoading(true);
    
    // Fetch jobs
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
        
        // Calculate stats
        const activeJobs = data.filter(job => job.status === 'Active').length;
        const totalApplications = data.reduce((sum, job) => sum + (job.applicationsCount || 0), 0);
        const avgApplications = data.length > 0 ? Math.round(totalApplications / data.length) : 0;
        
        setStats({
          totalJobs: data.length,
          totalApplications,
          activeJobs,
          avgApplicationsPerJob: avgApplications
        });
        setStatsLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setStatsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowJobs(true), 200);
      return () => { clearTimeout(t); };
    }
  }, [loading]);

  // Restore filteredJobs logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <CompanyDashboardSkeleton />
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Navbar
        profile={profile}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCreateClick={() => navigate('/company/jobs/new')}
        stats={stats}
        statsLoading={statsLoading}
        jobs={jobs}
      />
      {/* Jobs Grid and other dashboard content here, as before */}
      <div className={`transition-all duration-700 ease-out ${showJobs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} onClick={() => navigate(`/job/${job._id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 mt-6 sm:mt-8">
            <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}