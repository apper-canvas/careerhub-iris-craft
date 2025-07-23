import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className, 
  title = "No results found", 
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon = "Search",
  action,
  actionLabel = "Start Exploring"
}) => {
  return (
    <div className={cn("text-center py-16", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        {description}
      </p>
      
      {action && (
        <Button size="lg" onClick={action}>
          <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;