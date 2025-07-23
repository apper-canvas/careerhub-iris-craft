import React from "react";
import { cn } from "@/utils/cn";
import JobCard from "@/components/molecules/JobCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FeaturedJobs = ({ jobs, className, savedJobs = [], onSaveJob, onViewAll }) => {
  return (
    <section className={cn("py-16 bg-gradient-to-br from-gray-50 to-gray-100", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
            Featured <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Opportunities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover handpicked positions from top companies looking for talent like you
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {jobs.map((job) => (
            <JobCard
              key={job.Id}
              job={job}
              isSaved={savedJobs.includes(job.Id)}
              onSave={onSaveJob}
            />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={onViewAll}>
            View All Jobs
            <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;