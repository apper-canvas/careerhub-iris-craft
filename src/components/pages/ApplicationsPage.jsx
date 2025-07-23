import React from "react";
import { motion } from "framer-motion";
import ApplicationCard from "@/components/molecules/ApplicationCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { applicationService } from "@/services/api/applicationService";
import { jobService } from "@/services/api/jobService";

const ApplicationsPage = () => {
  const [applications, setApplications] = React.useState([]);
  const [jobs, setJobs] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      
      const applicationsData = await applicationService.getAll();
      setApplications(applicationsData);

      // Load job details for each application
      const jobIds = [...new Set(applicationsData.map(app => app.jobId))];
      const jobsData = {};
      
      for (const jobId of jobIds) {
        try {
          const job = await jobService.getById(jobId);
          jobsData[jobId] = job;
        } catch (err) {
          // Skip jobs that couldn't be loaded
          console.warn(`Could not load job ${jobId}:`, err.message);
        }
      }
      
      setJobs(jobsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadApplications} />;
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display text-gray-900">
                My <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Applications</span>
              </h1>
              <p className="text-xl text-gray-600">
                Track the status of your job applications
              </p>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {applications.length}
              </div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {getStatusCount("submitted")}
              </div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {getStatusCount("viewed")}
              </div>
              <div className="text-sm text-gray-600">Viewed</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {getStatusCount("interview")}
              </div>
              <div className="text-sm text-gray-600">Interviews</div>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Empty
              title="No Applications Yet"
              description="You haven't applied to any jobs yet. Start browsing opportunities and submit your first application!"
              icon="Send"
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
            {applications.map((application, index) => {
              const job = jobs[application.jobId];
              if (!job) return null;
              
              return (
                <motion.div
                  key={application.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ApplicationCard
                    application={application}
                    job={job}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;