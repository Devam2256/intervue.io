import { useState } from "react";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { Card } from "../common/ui/Card.jsx";
import { Badge } from "../common/ui/Badge";
import { StatsCardSkeleton } from "../common/ui/Shimmer";
import { Search, Plus, Briefcase, Users, Eye, Menu, Building } from "lucide-react";

const categories = ["All", "Tech", "Finance", "Healthcare", "Operations", "Management"];

export function Navbar({
  profile,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onCreateClick,
  stats,
  statsLoading,
  jobs,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getJobsByCategory = (category) => jobs.filter((job) => job.category === category);

  const statsData = [
    {
      title: "Total Jobs",
      value: stats.totalJobs || 0,
      description: "Active job postings",
      icon: Briefcase,
    },
    {
      title: "Total Applicants",
      value: stats.totalApplications || 0,
      description: "Across all jobs",
      icon: Users,
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs || 0,
      description: "Currently hiring",
      icon: Eye,
    },
    {
      title: "Avg. Applicants",
      value: stats.avgApplicationsPerJob || 0,
      description: "Per job posting",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6 mt-0 overflow-x-hidden px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {profile.logo ? (
              <img
                src={profile.logo || "/placeholder.svg"}
                alt={profile.companyName}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{profile.companyName}</h1>
          </div>
        </div>
        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-3 py-2"
          >
            <Menu className="h-4 w-4" />
            <span className="text-xs font-medium">Filters</span>
          </Button>
        </div>
      </div>
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
      {/* Search and Create Job */}
      <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-2 sm:gap-4 items-stretch w-full">
        <div className="relative flex-1 min-w-0 max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full min-w-0 max-w-full"
          />
        </div>
        <Button onClick={onCreateClick} className="flex-shrink-0 flex-grow-0 flex items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0" size="md">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create New Job</span>
          <span className="sm:hidden">Create Job</span>
        </Button>
      </div>
      {/* Category Filters */}
      <div className={`${showFilters ? "block" : "hidden"} sm:block w-full`}>
        <div className="flex flex-wrap gap-2 w-full">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "outline"}
              onClick={() => {
                onCategoryChange(category);
                setShowFilters(false);
              }}
              size="sm"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              {category}
              {category !== "All" && (
                <Badge variant="secondary" size="sm">
                  {getJobsByCategory(category).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
      {/* Click outside to close profile menu */}
      {showProfileMenu && <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setShowProfileMenu(false)} />}
    </div>
  );
}