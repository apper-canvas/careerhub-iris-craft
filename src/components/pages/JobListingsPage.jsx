import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import JobFilters from "@/components/organisms/JobFilters";
import JobGrid from "@/components/organisms/JobGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { jobService } from "@/services/api/jobService";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const JOBS_PER_PAGE = 8;

const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedJobs, saveJob } = useSavedJobs();
  
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalJobs, setTotalJobs] = React.useState(0);

  const [filters, setFilters] = React.useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    industry: searchParams.get("industry") || "",
    jobType: searchParams.get("jobType") || "",
    salary: searchParams.get("salary") || "",
  });

  React.useEffect(() => {
    loadJobs();
  }, [filters, currentPage]);

  React.useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, setSearchParams]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const allJobs = await jobService.getAll(filters);
      setTotalJobs(allJobs.length);
      
      // Paginate results
      const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
      const endIndex = startIndex + JOBS_PER_PAGE;
      const paginatedJobs = allJobs.slice(startIndex, endIndex);
      
      setJobs(paginatedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveJob = (jobId) => {
    saveJob(jobId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Find Your Perfect <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Job</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore thousands of opportunities from top companies worldwide
            </p>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search jobs by title, company, or keywords..."
              className="max-w-3xl mx-auto"
            />
          </motion.div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <ApperIcon name="Search" className="w-5 h-5" />
              <span className="font-medium">
                {loading ? "Searching..." : `${totalJobs.toLocaleString()} jobs found`}
              </span>
            </div>
            
            {Object.values(filters).some(value => value !== "") && (
              <button
                onClick={() => handleFiltersChange({
                  search: "",
                  location: "",
                  industry: "",
                  jobType: "",
                  salary: "",
                })}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <JobFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                className="mb-6 lg:mb-0"
              />
            </div>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            {loading && <Loading />}
            
            {error && (
              <Error message={error} onRetry={loadJobs} />
            )}
            
            {!loading && !error && jobs.length === 0 && (
              <Empty
                title="No jobs found"
                description="Try adjusting your search criteria or filters to find more opportunities."
                icon="Search"
                action={() => handleFiltersChange({
                  search: "",
                  location: "",
                  industry: "",
                  jobType: "",
                  salary: "",
                })}
                actionLabel="Clear Filters"
              />
            )}
            
            {!loading && !error && jobs.length > 0 && (
              <JobGrid
                jobs={jobs}
                savedJobs={savedJobs}
                onSaveJob={handleSaveJob}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingsPage;