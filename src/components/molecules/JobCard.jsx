import React from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const JobCard = ({ job, className, onSave, isSaved = false }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.Id}`);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onSave?.(job.Id);
    toast.success(isSaved ? "Job removed from saved" : "Job saved successfully!");
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

  return (
    <Card
      className={cn(
        "cursor-pointer hover:scale-[1.02] transition-all duration-300 group",
        className
      )}
      onClick={handleViewDetails}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
            <span className="font-medium">{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ApperIcon
            name="Heart"
            className={cn(
              "w-6 h-6 transition-colors",
              isSaved ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
            )}
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="primary">{job.type}</Badge>
        <Badge variant="secondary">{formatSalary(job.salary)}</Badge>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          <span>Posted {format(new Date(job.posted), "MMM d, yyyy")}</span>
        </div>
        <Button size="sm" onClick={handleViewDetails}>
          View Details
          <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;