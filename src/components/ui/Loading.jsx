import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "skeleton" }) => {
  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Skeleton loader for job cards
  return (
    <div className={cn("space-y-6", className)}>
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
            </div>
            <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32"></div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;