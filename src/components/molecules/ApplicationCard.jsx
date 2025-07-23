import React from "react";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ApplicationCard = ({ application, job, className }) => {
  const navigate = useNavigate();

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

  const handleViewJob = () => {
    navigate(`/jobs/${job.Id}`);
  };

  return (
    <Card className={cn("hover:scale-[1.01] transition-all duration-300", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
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
        <Badge variant={getStatusVariant(application.status)}>
          {application.status}
        </Badge>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
        <span>Applied on {format(new Date(application.appliedDate), "MMM d, yyyy")}</span>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleViewJob}>
          View Job
          <ApperIcon name="ExternalLink" className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default ApplicationCard;