import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { jobService } from "@/services/api/jobService";
import { applicationService } from "@/services/api/applicationService";
import { resumeService } from "@/services/api/resumeService";
import { useSavedJobs } from "@/hooks/useSavedJobs";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedJobs, saveJob, isSaved } = useSavedJobs();
  
  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [applying, setApplying] = React.useState(false);
  const [hasApplied, setHasApplied] = React.useState(false);

  React.useEffect(() => {
    loadJob();
    checkApplicationStatus();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");
      const jobData = await jobService.getById(id);
      setJob(jobData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationService.getAll();
      const existingApplication = applications.find(app => app.jobId === parseInt(id));
      setHasApplied(!!existingApplication);
    } catch (err) {
      // Ignore error for application check
    }
  };

  const handleSaveJob = () => {
    saveJob(parseInt(id));
    toast.success(isSaved(parseInt(id)) ? "Job removed from saved" : "Job saved successfully!");
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      
      // Get user's default resume
      const resumes = await resumeService.getAll();
      const defaultResume = resumes.find(resume => resume.isDefault);
      
      if (!defaultResume) {
        toast.error("Please upload a resume before applying");
        navigate("/resumes");
        return;
      }

      // Create application
      await applicationService.create({
        jobId: parseInt(id),
        resumeId: defaultResume.Id,
        coverLetter: `I am interested in applying for the ${job.title} position at ${job.company}.`
      });

      setHasApplied(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary.min) {
      return `From $${salary.min.toLocaleString()}`;
    }
    if (salary.max) {
      return `Up to $${salary.max.toLocaleString()}`;
    }
    return "Competitive salary";
  };

  if (loading) {
    return <Loading type="spinner" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadJob} />;
  }

  if (!job) {
    return <Error message="Job not found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span className="font-medium">Back to Jobs</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold font-display text-gray-900 mb-4">
                      {job.title}
                    </h1>
                    <div className="flex items-center space-x-6 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <ApperIcon name="Building2" className="w-5 h-5 mr-2" />
                        <span className="font-medium text-lg">{job.company}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="primary" className="text-sm px-4 py-2">
                        {job.type}
                      </Badge>
                      <Badge variant="secondary" className="text-sm px-4 py-2">
                        {formatSalary(job.salary)}
                      </Badge>
                      {job.featured && (
                        <Badge variant="accent" className="text-sm px-4 py-2">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSaveJob}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon
                      name="Heart"
                      className={`w-7 h-7 transition-colors ${
                        isSaved(parseInt(id)) 
                          ? "fill-red-500 text-red-500" 
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  <span>Posted {format(new Date(job.posted), "MMMM d, yyyy")}</span>
                  <span className="mx-2">•</span>
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                  <span>Apply by {format(new Date(job.deadline), "MMMM d, yyyy")}</span>
                </div>
              </Card>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {job.description}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <ApperIcon name="Check" className="w-5 h-5 text-accent-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon name="Star" className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Apply Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Send" className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Ready to Apply?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Submit your application and take the next step in your career
                    </p>
                  </div>

                  {hasApplied ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ApperIcon name="Check" className="w-6 h-6 text-accent-600" />
                      </div>
                      <p className="text-accent-600 font-medium mb-4">Application Submitted</p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/applications")}
                      >
                        View Application Status
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full mb-4"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? (
                        <>
                          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/resumes")}
                  >
                    <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                    Manage Resumes
                  </Button>
                </Card>
              </motion.div>

              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About {job.company}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Building2" className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Technology Company</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Users" className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">501-1000 employees</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;