import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { alertService } from "@/services/api/alertService";

const JobAlertsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingAlert, setEditingAlert] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    title: "",
    location: "",
    industry: "",
    jobType: "",
    salary: "",
    frequency: "daily"
  });

  const locationOptions = [
    { value: "", label: "Any Location" },
    { value: "remote", label: "Remote" },
    { value: "new-york", label: "New York, NY" },
    { value: "san-francisco", label: "San Francisco, CA" },
    { value: "chicago", label: "Chicago, IL" },
    { value: "austin", label: "Austin, TX" },
    { value: "seattle", label: "Seattle, WA" },
  ];

  const industryOptions = [
    { value: "", label: "Any Industry" },
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "marketing", label: "Marketing" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
  ];

  const jobTypeOptions = [
    { value: "", label: "Any Job Type" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ];

  const salaryOptions = [
    { value: "", label: "Any Salary" },
    { value: "0-50000", label: "$0 - $50,000" },
    { value: "50000-75000", label: "$50,000 - $75,000" },
    { value: "75000-100000", label: "$75,000 - $100,000" },
    { value: "100000-150000", label: "$100,000 - $150,000" },
    { value: "150000+", label: "$150,000+" },
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  React.useEffect(() => {
    loadAlerts();
    
    // Pre-populate form from URL params if creating new alert
    const urlParams = Object.fromEntries(searchParams.entries());
    if (Object.keys(urlParams).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...urlParams,
        name: generateAlertName(urlParams)
      }));
      setShowCreateForm(true);
    }
  }, [searchParams]);

  const generateAlertName = (criteria) => {
    const parts = [];
    if (criteria.title) parts.push(criteria.title);
    if (criteria.location) parts.push(criteria.location.replace("-", " "));
    if (criteria.industry) parts.push(criteria.industry);
    return parts.join(" ") || "Job Alert";
  };

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const alertsData = await alertService.getAll();
      setAlerts(alertsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = () => {
    setEditingAlert(null);
    setFormData({
      name: "",
      title: "",
      location: "",
      industry: "",
      jobType: "",
      salary: "",
      frequency: "daily"
    });
    setShowCreateForm(true);
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      title: alert.title || "",
      location: alert.location || "",
      industry: alert.industry || "",
      jobType: alert.jobType || "",
      salary: alert.salary || "",
      frequency: alert.frequency
    });
    setShowCreateForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter an alert name");
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingAlert) {
        await alertService.update(editingAlert.Id, formData);
        toast.success("Alert updated successfully!");
      } else {
        await alertService.create(formData);
        toast.success("Alert created successfully!");
      }
      
      await loadAlerts();
      setShowCreateForm(false);
      setEditingAlert(null);
    } catch (err) {
      toast.error("Failed to save alert. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (alert) => {
    try {
      await alertService.toggleActive(alert.Id);
      toast.success(`Alert ${alert.isActive ? 'paused' : 'activated'} successfully!`);
      await loadAlerts();
    } catch (err) {
      toast.error("Failed to update alert status.");
    }
  };

  const handleDeleteAlert = async (alert) => {
    if (!confirm(`Are you sure you want to delete "${alert.name}"?`)) {
      return;
    }

    try {
      await alertService.delete(alert.Id);
      toast.success("Alert deleted successfully!");
      await loadAlerts();
    } catch (err) {
      toast.error("Failed to delete alert.");
    }
  };

  const formatCriteria = (alert) => {
    const criteria = [];
    if (alert.title) criteria.push(`Title: ${alert.title}`);
    if (alert.location) {
      const location = locationOptions.find(opt => opt.value === alert.location)?.label || alert.location;
      criteria.push(`Location: ${location}`);
    }
    if (alert.industry) {
      const industry = industryOptions.find(opt => opt.value === alert.industry)?.label || alert.industry;
      criteria.push(`Industry: ${industry}`);
    }
    if (alert.jobType) {
      const jobType = jobTypeOptions.find(opt => opt.value === alert.jobType)?.label || alert.jobType;
      criteria.push(`Type: ${jobType}`);
    }
    if (alert.salary) {
      const salary = salaryOptions.find(opt => opt.value === alert.salary)?.label || alert.salary;
      criteria.push(`Salary: ${salary}`);
    }
    return criteria.join(" • ");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAlerts} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">
                Job <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Alerts</span>
              </h1>
              <p className="text-xl text-gray-600">
                Stay notified about jobs that match your criteria
              </p>
            </div>
            <Button
              onClick={handleCreateAlert}
              className="mt-4 sm:mt-0"
            >
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Create Alert
            </Button>
          </div>
        </motion.div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAlert ? "Edit Alert" : "Create New Alert"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Frontend Developer Remote"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Select
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    >
                      {locationOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <Select
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    >
                      {industryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <Select
                      value={formData.jobType}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
                    >
                      {jobTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <Select
                      value={formData.salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    >
                      {salaryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Frequency
                    </label>
                    <Select
                      value={formData.frequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        {editingAlert ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                        {editingAlert ? "Update Alert" : "Create Alert"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {alerts.length === 0 ? (
            <Empty
              title="No Job Alerts Created"
              description="Create your first job alert to get notified about relevant opportunities"
              icon="Bell"
              action={handleCreateAlert}
              actionLabel="Create Alert"
            />
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.Id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{alert.name}</h3>
                        <Badge variant={alert.isActive ? "success" : "default"}>
                          {alert.isActive ? "Active" : "Paused"}
                        </Badge>
                        <Badge variant="primary" className="text-xs">
                          {alert.frequency}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {formatCriteria(alert) || "No specific criteria set"}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-xs text-gray-500">
                        <div className="flex items-center">
                          <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                          {alert.matchCount} matches found
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          Created {new Date(alert.createdDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                          Last checked {new Date(alert.lastChecked).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(alert)}
                      >
                        <ApperIcon 
                          name={alert.isActive ? "Pause" : "Play"} 
                          className="w-4 h-4 mr-1" 
                        />
                        {alert.isActive ? "Pause" : "Activate"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAlert(alert)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert)}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JobAlertsPage;