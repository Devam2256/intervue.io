// UserDashboard: Main dashboard for job seekers to browse and apply for jobs
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// Remove this import since we're using SleekNavbar instead
// import { UserNavbar } from "./UserNavbar";
import { JobCard } from "../company/JobCard"
import { JobCardSkeleton, UserDashboardSkeleton, StatsCardSkeleton } from "../common/ui/Shimmer"
import { Search, Filter, MapPin, Briefcase, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { Input } from "../common/ui/Input"
import { Button } from "../common/ui/Button"
import { Card } from "../common/ui/Card"
import ShinyText from "../common/ui/ShinyText" // Add this import

export function UserDashboard({ user }) {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([]) // Added missing companies state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [showJobs, setShowJobs] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setShowJobs(false);
    setLoading(true);
    setStatsLoading(true);
    
    const fetchData = async () => {
      try {
        // Make sure user is loaded before accessing user._id
        if (!user || !user._id) {
          console.log('User data not available yet');
          return;
        }
        
        // Modified to handle potential missing endpoint
        const jobsResponse = await fetch("/api/jobs");
        let applicationsData = [];
        
        try {
          // Try to fetch applications, but handle gracefully if endpoint doesn't exist
          const applicationsResponse = await fetch(`/api/candidates/user/${user._id}`);
          if (applicationsResponse.ok) {
            applicationsData = await applicationsResponse.json();
          }
        } catch (error) {
          console.error('Error fetching applications:', error);
          // Set empty applications data if endpoint doesn't exist
          applicationsData = [];
        }
        
        try {
          // Try to fetch companies, but handle gracefully if it fails
          const companiesResponse = await fetch("/api/companies");
          if (companiesResponse.ok) {
            const companiesData = await companiesResponse.json();
            setCompanies(companiesData);
          }
        } catch (error) {
          console.error('Error fetching companies:', error);
          // Set empty companies array if endpoint doesn't exist
          setCompanies([]);
        }
        
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }
        
        // Calculate stats from applications data
        const totalApplications = applicationsData.length;
        const acceptedApplications = applicationsData.filter(
          app => app.status === 'Hired' || app.status === 'Shortlisted'
        ).length;
        const rejectedApplications = applicationsData.filter(
          app => app.status === 'Rejected'
        ).length;
        const pendingApplications = applicationsData.filter(
          app => ['Applied', 'Reviewing', 'Interview'].includes(app.status)
        ).length;
        
        setStats({
          totalApplications,
          acceptedApplications,
          rejectedApplications,
          pendingApplications
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };
    
    fetchData();
  }, [user]); // Added user as a dependency

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowJobs(true), 200);
      return () => { clearTimeout(t); };
    }
  }, [loading]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Use companies array to find the company name
      (job.company_id && companies.find(c => c._id === job.company_id)?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(jobs.map(job => job.category).filter(Boolean))];
  
  const statsData = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      description: "Jobs you've applied to",
      icon: FileText,
    },
    {
      title: "Accepted",
      value: stats.acceptedApplications,
      description: "Shortlisted or hired",
      icon: CheckCircle,
    },
    {
      title: "Rejected",
      value: stats.rejectedApplications,
      description: "Applications rejected",
      icon: XCircle,
    },
    {
      title: "In Progress",
      value: stats.pendingApplications,
      description: "Awaiting response",
      icon: Clock,
    },
  ];

  if (loading) {
    return <UserDashboardSkeleton />
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Remove the UserNavbar component from here */}
      <div className="space-y-6 mt-0 overflow-x-hidden px-2 sm:px-0">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <ShinyText 
              text="Find Your Dream Job" 
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2"
              isLink={false}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Discover opportunities that match your skills and aspirations</p>
          </div>
          <Button
            variant="sleek"
            onClick={() => navigate('/user/profile')}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            My Profile
          </Button>
        </div>
        
        {/* Rest of the component remains the same */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, index) => <StatsCardSkeleton key={index} />)
            : statsData.map((stat, index) => (
                <Card key={index} className="p-3 sm:p-6 w-full">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                      {stat.title}
                    </h3>
                    <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{stat.description}</p>
                </Card>
              ))}
        </div>
        
        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-2 sm:gap-4 items-stretch w-full mb-4">
          <div className="relative flex-1 min-w-0 max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full min-w-0 max-w-full"
            />
          </div>
        </div>
        <div className="w-full mb-6">
          <div className="flex flex-wrap gap-2 w-full">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className="flex items-center gap-1.5 text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {/* Jobs Grid */}
        <div className={`transition-all duration-700 ease-out ${showJobs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {filteredJobs.map((job) => {
                // Find the company for this job
                const company = companies.find(c => c._id === job.company_id);
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
    </div>
  );
}