import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FeaturedJobs from "@/components/organisms/FeaturedJobs";
import CategoryBrowser from "@/components/organisms/CategoryBrowser";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { jobService } from "@/services/api/jobService";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const HomePage = () => {
  const navigate = useNavigate();
  const { savedJobs, saveJob } = useSavedJobs();
  const [featuredJobs, setFeaturedJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const jobs = await jobService.getFeatured();
      setFeaturedJobs(jobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/jobs");
    }
  };

  const handleSaveJob = (jobId) => {
    saveJob(jobId);
  };

  const handleViewAllJobs = () => {
    navigate("/jobs");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadFeaturedJobs} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
              Find Your Dream{" "}
              <span className="bg-gradient-to-r from-accent-300 to-white bg-clip-text text-transparent">
                Career
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto">
              Discover thousands of opportunities from top companies worldwide. 
              Your next career breakthrough is just one search away.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center mb-16"
            >
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search jobs by title, company, or keywords..."
                className="max-w-4xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-300 mb-2">10K+</div>
                <div className="text-primary-100">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-300 mb-2">5K+</div>
                <div className="text-primary-100">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-300 mb-2">100K+</div>
                <div className="text-primary-100">Success Stories</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-400/20 rounded-full blur-2xl"></div>
      </section>

      {/* Featured Jobs */}
      <FeaturedJobs
        jobs={featuredJobs}
        savedJobs={savedJobs}
        onSaveJob={handleSaveJob}
        onViewAll={handleViewAllJobs}
      />

      {/* Category Browser */}
      <CategoryBrowser />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through CareerHub. 
              Your future starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="accent"
                onClick={() => navigate("/jobs")}
                className="text-lg px-8 py-4"
              >
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Browse All Jobs
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/resumes")}
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
              >
                <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
                Upload Resume
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;