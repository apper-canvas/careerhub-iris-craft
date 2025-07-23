import React from "react";
import { cn } from "@/utils/cn";
import JobCard from "@/components/molecules/JobCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const JobGrid = ({ jobs, className, savedJobs = [], onSaveJob, currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {jobs.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                key={job.Id}
                job={job}
                isSaved={savedJobs.includes(job.Id)}
                onSave={onSaveJob}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ApperIcon name="ChevronRight" className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default JobGrid;