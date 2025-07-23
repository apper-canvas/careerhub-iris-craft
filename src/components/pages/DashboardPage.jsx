import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { applicationService } from "@/services/api/applicationService";
import { jobService } from "@/services/api/jobService";
import { resumeService } from "@/services/api/resumeService";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { savedJobs } = useSavedJobs();
  
  const [applications, setApplications] = React.useState([]);
  const [recentJobs, setRecentJobs] = React.useState([]);
  const [resumes, setResumes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [applicationsData, resumesData, allJobs] = await Promise.all([
        applicationService.getAll(),
        resumeService.getAll(),
        jobService.getAll()
      ]);

      setApplications(applicationsData.slice(0, 3)); // Show only recent applications
      setResumes(resumesData);
      setRecentJobs(allJobs.slice(0, 4)); // Show recent jobs
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "primary";
      case "viewed":
        return "secondary";
      case "interview":
        return "accent";
      case "rejected":
        return "error";
      case "accepted":
        return "success";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
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
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">
            Welcome Back to Your <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600">
            Track your applications, manage your profile, and discover new opportunities
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Send" className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Heart" className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
                <p className="text-sm text-gray-600">Saved Jobs</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="FileText" className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
                <p className="text-sm text-gray-600">Resumes</p>
              </div>
            </div>
</Card>

          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Bell" className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Job Alerts</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-gray-600">Profile Score</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/applications")}
                >
                  View All
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {applications.length === 0 ? (
                <Empty
                  title="No Applications Yet"
                  description="Start applying to jobs to see your applications here."
                  icon="Send"
                  action={() => navigate("/jobs")}
                  actionLabel="Browse Jobs"
                />
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => {
                    const job = recentJobs.find(j => j.Id === application.jobId);
                    if (!job) return null;
                    
                    return (
                      <div
                        key={application.Id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/jobs/${job.Id}`)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusVariant(application.status)} className="mb-1">
                            {application.status}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <Button
                  className="w-full justify-start"
                  onClick={() => navigate("/jobs")}
                  size="lg"
                >
                  <ApperIcon name="Search" className="w-5 h-5 mr-3" />
                  Browse New Jobs
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/resumes")}
                  size="lg"
                >
                  <ApperIcon name="Upload" className="w-5 h-5 mr-3" />
                  Upload Resume
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/saved-jobs")}
                  size="lg"
                >
                  <ApperIcon name="Heart" className="w-5 h-5 mr-3" />
                  View Saved Jobs
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/applications")}
                  size="lg"
                >
                  <ApperIcon name="FileText" className="w-5 h-5 mr-3" />
                  Track Applications
</Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/job-alerts")}
                  size="lg"
                >
                  <ApperIcon name="Bell" className="w-5 h-5 mr-3" />
                  Manage Job Alerts
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recommended Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/jobs")}
              >
                View All
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {recentJobs.slice(0, 4).map((job) => (
                <div
                  key={job.Id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.Id}`)}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" className="text-xs">
                      {job.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{job.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;