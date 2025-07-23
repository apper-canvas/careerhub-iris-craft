import React from "react";
import { motion } from "framer-motion";
import JobCard from "@/components/molecules/JobCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { jobService } from "@/services/api/jobService";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const SavedJobsPage = () => {
  const { savedJobs, saveJob } = useSavedJobs();
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    loadSavedJobs();
  }, [savedJobs]);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (savedJobs.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // Load all jobs and filter by saved job IDs
      const allJobs = await jobService.getAll();
      const savedJobsData = allJobs.filter(job => savedJobs.includes(job.Id));
      setJobs(savedJobsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = (jobId) => {
    saveJob(jobId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadSavedJobs} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display text-gray-900">
                Saved <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Jobs</span>
              </h1>
              <p className="text-xl text-gray-600">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} saved for later
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Empty
              title="No Saved Jobs Yet"
              description="Start browsing jobs and save the ones you're interested in. They'll appear here for easy access later."
              icon="Heart"
              action={() => window.location.href = "/jobs"}
              actionLabel="Browse Jobs"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
          >
            {jobs.map((job, index) => (
              <motion.div
                key={job.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <JobCard
                  job={job}
                  isSaved={true}
                  onSave={handleSaveJob}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;