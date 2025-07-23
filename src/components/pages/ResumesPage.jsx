import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ResumeCard from "@/components/molecules/ResumeCard";
import FileUpload from "@/components/organisms/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { resumeService } from "@/services/api/resumeService";

const ResumesPage = () => {
  const [resumes, setResumes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selectedProfile, setSelectedProfile] = React.useState(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [profileLoading, setProfileLoading] = React.useState(false);
  React.useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");
      const resumesData = await resumeService.getAll();
      setResumes(resumesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (resumeData) => {
    try {
      const newResume = await resumeService.create(resumeData);
      setResumes(prev => [newResume, ...prev]);
    } catch (err) {
      toast.error("Failed to save resume. Please try again.");
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await resumeService.delete(resumeId);
      setResumes(prev => prev.filter(resume => resume.Id !== resumeId));
    } catch (err) {
      toast.error("Failed to delete resume. Please try again.");
    }
  };

  const handleSetDefault = async (resumeId) => {
    try {
      await resumeService.setDefault(resumeId);
      setResumes(prev => prev.map(resume => ({
        ...resume,
        isDefault: resume.Id === resumeId
      })));
    } catch (err) {
      toast.error("Failed to set default resume. Please try again.");
    }
};

  const loadProfile = async (resumeId) => {
    try {
      setProfileLoading(true);
      const profile = await resumeService.getProfile(resumeId);
      setSelectedProfile(profile);
      setShowProfile(true);
    } catch (err) {
      toast.error("Failed to load candidate profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleViewProfile = async (resumeId) => {
    await loadProfile(resumeId);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedProfile(null);
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadResumes} />;
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
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-display text-gray-900">
                Resume <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">Manager</span>
              </h1>
              <p className="text-xl text-gray-600">
                Upload and manage your resumes for job applications
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-8"
            >
              <FileUpload
                onFileUpload={handleFileUpload}
                acceptedTypes=".pdf,.doc,.docx"
              />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <ApperIcon name="Info" className="w-4 h-4 mr-2" />
                  Tips for Better Resumes
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Keep it to 1-2 pages maximum</li>
                  <li>• Use a clean, professional format</li>
                  <li>• Include relevant keywords</li>
                  <li>• Highlight your achievements</li>
                  <li>• Save as PDF for best compatibility</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Resumes List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Resumes ({resumes.length})
              </h2>

              {resumes.length === 0 ? (
                <Empty
                  title="No Resumes Uploaded"
                  description="Upload your first resume to start applying for jobs. You can upload multiple versions and set one as default."
                  icon="Upload"
                  actionLabel="Get Started"
                />
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume, index) => (
                    <motion.div
                      key={resume.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
<ResumeCard
                        resume={resume}
                        isDefault={resume.isDefault}
                        onDelete={handleDeleteResume}
                        onSetDefault={handleSetDefault}
                        onViewProfile={handleViewProfile}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
</motion.div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfile && selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="User" className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedProfile.personalInfo.name}
                      </h2>
                      <p className="text-gray-600">{selectedProfile.personalInfo.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseProfile}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ApperIcon name="Contact" className="w-5 h-5 mr-2 text-primary-600" />
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Mail" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedProfile.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Phone" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedProfile.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedProfile.personalInfo.location}</span>
                    </div>
                    {selectedProfile.personalInfo.linkedin && (
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Linkedin" className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedProfile.personalInfo.linkedin}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ApperIcon name="Briefcase" className="w-5 h-5 mr-2 text-primary-600" />
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {selectedProfile.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary-200 pl-4">
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p className="text-primary-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ApperIcon name="Star" className="w-5 h-5 mr-2 text-primary-600" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ApperIcon name="GraduationCap" className="w-5 h-5 mr-2 text-primary-600" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {selectedProfile.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-secondary-200 pl-4">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-secondary-600 font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumesPage;