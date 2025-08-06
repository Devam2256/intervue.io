// UserDashboard: Main dashboard for job seekers to browse and apply for jobs
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { JobCard } from "../company/JobCard"
import { JobCardSkeleton } from "../common/ui/Shimmer"
import { FilterButton } from "../common/ui/DashboardHeader"
import { StatsCard, StatsGrid } from "../common/ui/StatsCard"
import { DashboardHeader } from "../common/ui/DashboardHeader"
import { ApplicationHistoryModal } from "./ApplicationHistoryModal"
import { Briefcase, FileText, CheckCircle, Clock, XCircle, User } from "lucide-react"

export function UserDashboard({ user }) {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [showJobs, setShowJobs] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryTitle, setSelectedHistoryTitle] = useState('');

  // Debug user data
  useEffect(() => {
    console.log('UserDashboard - User data:', user);
  }, [user]);

  const categories = ["All", "Technology", "Finance", "Healthcare", "Education", "Marketing", "Sales", "Operations"]

  const fetchData = async () => {
    setLoading(true);
    setStatsLoading(true);
    
    try {
      // Fetch jobs with populated company data
      const jobsResponse = await fetch("/api/jobs", {
        credentials: 'include'
      });
      
      console.log('UserDashboard - Jobs response status:', jobsResponse.status);
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        console.log('UserDashboard - Fetched jobs:', jobsData);
        console.log('UserDashboard - Sample job with company data:', jobsData[0]);
        setJobs(jobsData);
      } else {
        console.error('UserDashboard - Failed to fetch jobs:', jobsResponse.status);
      }

      // Fetch user's applications
      if (user?._id) {
        const applicationsResponse = await fetch(`/api/candidates/user/${user._id}`, {
          credentials: 'include'
        });
        
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          console.log('UserDashboard - Fetched applications:', applicationsData);
          
          // Store applications for history modal
          setApplications(applicationsData);
          
          // Calculate stats from applications
          const totalApplications = applicationsData.length;
          const acceptedApplications = applicationsData.filter(app => app.status === 'Accepted').length;
          const pendingApplications = applicationsData.filter(app => ['Applied', 'Reviewing', 'Interview', 'Scheduled'].includes(app.status)).length;
          const rejectedApplications = applicationsData.filter(app => app.status === 'Rejected').length;
          
          setStats({
            totalApplications,
            acceptedApplications,
            pendingApplications,
            rejectedApplications
          });
        }
      }

      // Companies data will come from the jobs API with populated company information
      setCompanies([]);
    } catch (error) {
      console.error('UserDashboard - Error fetching data:', error);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowJobs(true), 200);
      return () => { clearTimeout(t); };
    }
  }, [loading]);

  // Filter jobs based on search term and category
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_id?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle stats card click to show application history
  const handleStatsClick = (title) => {
    setSelectedHistoryTitle(title);
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Custom Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-4 mb-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Welcome Message */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Dashboard
              </h1>
              <p className="text-base font-bold text-gray-700 dark:text-gray-300">
                Welcome back, {user?.firstName || 'Job Seeker'}! 
              </p>
            </div>
          </div>

          {/* Search and filters section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <FilterButton
                    key={category}
                    active={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <StatsGrid className="mb-8">
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={FileText}
            color="blue"
            loading={statsLoading}
            onClick={() => handleStatsClick("Total Applications")}
            clickable={true}
          />
          <StatsCard
            title="Accepted"
            value={stats.acceptedApplications}
            icon={CheckCircle}
            color="green"
            loading={statsLoading}
            onClick={() => handleStatsClick("Accepted")}
            clickable={true}
          />
          <StatsCard
            title="In Progress"
            value={stats.pendingApplications}
            icon={Clock}
            color="yellow"
            loading={statsLoading}
            onClick={() => handleStatsClick("In Progress")}
            clickable={true}
          />
          <StatsCard
            title="Rejected"
            value={stats.rejectedApplications}
            icon={XCircle}
            color="red"
            loading={statsLoading}
            onClick={() => handleStatsClick("Rejected")}
            clickable={true}
          />
        </StatsGrid>

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
                                        {filteredJobs.map((job) => {
                            // Use the populated company data from the job
                            const company = job.company_id;
                            console.log('UserDashboard - Rendering job card with company:', company);
                            console.log('UserDashboard - Job ID:', job._id);
                            console.log('UserDashboard - Company ID:', company?._id);
                            return (
                              <JobCard 
                                key={job._id} 
                                job={job}
                                company={company} // Pass company data to JobCard
                                onClick={() => navigate(`/user/job/${job._id}`)} 
                              />
                            );
                          })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application History Modal */}
      <ApplicationHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        applications={applications}
        title={selectedHistoryTitle}
        user={user}
      />
    </div>
  );
}