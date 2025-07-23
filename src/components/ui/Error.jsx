import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ className, message = "Something went wrong", onRetry }) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}. Don't worry, it happens! Please try again or contact support if the problem persists.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="mr-4">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
      
      <Button variant="outline" onClick={() => window.location.reload()}>
        <ApperIcon name="Home" className="w-4 h-4 mr-2" />
        Go Home
      </Button>
    </div>
  );
};

export default Error;