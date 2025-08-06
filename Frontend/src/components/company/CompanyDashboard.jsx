// CompanyDashboard: Main dashboard for managing jobs, stats, and filters
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { JobCard } from "./JobCard"
import { CreateJobForm } from "./CreateJobForm"
import { JobCardSkeleton } from "../common/ui/Shimmer"
import { FilterButton } from "../common/ui/DashboardHeader"
import { StatsCard, StatsGrid } from "../common/ui/StatsCard"
import { Button } from "../common/ui/Button"
import { Briefcase, Users, CheckCircle, TrendingUp, Search, Plus, Calendar } from "lucide-react"

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
  
  // Debug profile data
  useEffect(() => {
    console.log('CompanyDashboard - Profile data:', profile);
    console.log('CompanyDashboard - Profile logo:', profile?.logo);
    console.log('CompanyDashboard - Profile name:', profile?.name);
    console.log('CompanyDashboard - Profile ID:', profile?._id);
  }, [profile]);
  
  useEffect(() => {
    setShowJobs(false);
    setLoading(true);
    setStatsLoading(true);
    
    // Fetch jobs for this company only
    if (profile?._id) {
      const fetchData = async () => {
        try {
          const jobsResponse = await fetch(`/api/jobs/company/${profile._id}`, { credentials: 'include' });
          const data = await jobsResponse.json();
          console.log('CompanyDashboard - Fetched company jobs:', data);
          setJobs(data);
          setLoading(false);
          
          // Calculate stats
          const activeJobs = data.filter(job => job.status === 'Active').length;
          const totalApplications = data.reduce((sum, job) => sum + (job.applicationsCount || 0), 0);
          const avgApplications = data.length > 0 ? Math.round(totalApplications / data.length) : 0;
          
          // Fetch candidates for this company to get more detailed stats
          const candidatesResponse = await fetch(`/api/candidates`, { credentials: 'include' });
          if (candidatesResponse.ok) {
            const allCandidates = await candidatesResponse.json();
            const companyCandidates = allCandidates.filter(candidate => 
              candidate.company_id && candidate.company_id._id === profile._id
            );
            
            const acceptedCandidates = companyCandidates.filter(candidate => candidate.status === 'Accepted').length;
            const scheduledCandidates = companyCandidates.filter(candidate => candidate.status === 'Scheduled').length;
            const rejectedCandidates = companyCandidates.filter(candidate => candidate.status === 'Rejected').length;
            
            setStats({
              totalJobs: data.length,
              totalApplications: totalApplications,
              activeJobs,
              avgApplicationsPerJob: avgApplications,
              acceptedCandidates,
              scheduledCandidates,
              rejectedCandidates
            });
          } else {
            setStats({
              totalJobs: data.length,
              totalApplications,
              activeJobs,
              avgApplicationsPerJob: avgApplications,
              acceptedCandidates: 0,
              scheduledCandidates: 0,
              rejectedCandidates: 0
            });
          }
          setStatsLoading(false);
        } catch (error) {
          console.error('CompanyDashboard - Error fetching company jobs:', error);
          setLoading(false);
          setStatsLoading(false);
        }
      };
      
      fetchData();
    } else {
      // No profile yet, set empty state
      setJobs([]);
      setLoading(false);
      setStatsLoading(false);
      setStats({
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        avgApplicationsPerJob: 0,
        acceptedCandidates: 0,
        scheduledCandidates: 0,
        rejectedCandidates: 0
      });
    }
  }, [profile?._id]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="w-full px-2 sm:px-4 lg:px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {profile?.logo ? (
              <img
                src={profile.logo}
                alt={profile.name || "Company Logo"}
                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  console.error('CompanyDashboard - Logo failed to load:', profile.logo);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Company Dashboard
              </h1>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {profile?.name || 'Company'}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome back! Manage your jobs and applications.
          </p>
          
          {/* Search and Create Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={() => navigate('/company/jobs/new')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid className="mb-8">
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={Briefcase}
            color="blue"
            loading={statsLoading}
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={Users}
            color="green"
            loading={statsLoading}
          />
          <StatsCard
            title="Accepted Candidates"
            value={stats.acceptedCandidates || 0}
            icon={CheckCircle}
            color="green"
            loading={statsLoading}
          />
          <StatsCard
            title="Scheduled Interviews"
            value={stats.scheduledCandidates || 0}
            icon={Calendar}
            color="yellow"
            loading={statsLoading}
          />
        </StatsGrid>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Technology", "Finance", "Healthcare", "Education", "Marketing", "Sales"].map((category) => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Jobs Grid */}
        <div className={`transition-all duration-700 ease-out ${showJobs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                  company={job.company_id} // Pass the populated company data
                  onClick={() => navigate(`/job/${job._id}`)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search terms or filters."
                  : "Get started by posting your first job!"
                }
              </p>
              {!searchTerm && selectedCategory === "All" && (
                <Button onClick={() => navigate('/company/jobs/new')}>
                  Post Your First Job
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}