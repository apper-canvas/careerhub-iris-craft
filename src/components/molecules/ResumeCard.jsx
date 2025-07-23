import React from "react";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ResumeCard = ({ resume, className, onDelete, onSetDefault, isDefault = false }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      onDelete?.(resume.Id);
      toast.success("Resume deleted successfully");
    }
  };

  const handleSetDefault = () => {
    onSetDefault?.(resume.Id);
    toast.success("Default resume updated");
  };

  const handleDownload = () => {
    // Simulate download
    toast.info("Download functionality would be implemented here");
  };

  return (
    <Card className={cn("hover:scale-[1.01] transition-all duration-300", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-4">
            <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {resume.filename}
            </h3>
            <p className="text-sm text-gray-500">
              Uploaded {format(new Date(resume.uploadDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        {isDefault && (
          <Badge variant="accent">Default</Badge>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <ApperIcon name="Download" className="w-4 h-4 mr-1" />
            Download
          </Button>
          {!isDefault && (
            <Button variant="ghost" size="sm" onClick={handleSetDefault}>
              Set as Default
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ResumeCard;