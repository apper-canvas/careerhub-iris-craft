import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FilterGroup from "@/components/molecules/FilterGroup";
import ApperIcon from "@/components/ApperIcon";

const JobFilters = ({ filters, onFiltersChange, className }) => {
  const locationOptions = [
    { value: "remote", label: "Remote" },
    { value: "new-york", label: "New York, NY" },
    { value: "san-francisco", label: "San Francisco, CA" },
    { value: "chicago", label: "Chicago, IL" },
    { value: "austin", label: "Austin, TX" },
    { value: "seattle", label: "Seattle, WA" },
  ];

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "marketing", label: "Marketing" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
  ];

  const jobTypeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ];

  const salaryOptions = [
    { value: "0-50000", label: "$0 - $50,000" },
    { value: "50000-75000", label: "$50,000 - $75,000" },
    { value: "75000-100000", label: "$75,000 - $100,000" },
    { value: "100000-150000", label: "$100,000 - $150,000" },
    { value: "150000+", label: "$150,000+" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      location: "",
      industry: "",
      jobType: "",
      salary: "",
    });
};

  const handleCreateAlert = () => {
    // Navigate to job alerts page with current filters as query params
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    window.location.href = `/job-alerts?${searchParams.toString()}`;
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-primary-600 hover:text-primary-700"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Clear All
</Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCreateAlert()}
          className="text-primary-600 hover:text-primary-700 border-primary-200 hover:border-primary-300"
        >
          <ApperIcon name="Bell" className="w-4 h-4 mr-1" />
          Create Alert
        </Button>
      </div>

      <div className="space-y-6">
        <FilterGroup
          title="Location"
          options={locationOptions}
          value={filters.location}
          onChange={(value) => handleFilterChange("location", value)}
        />

        <FilterGroup
          title="Industry"
          options={industryOptions}
          value={filters.industry}
          onChange={(value) => handleFilterChange("industry", value)}
        />

        <FilterGroup
          title="Job Type"
          options={jobTypeOptions}
          value={filters.jobType}
          onChange={(value) => handleFilterChange("jobType", value)}
        />

        <FilterGroup
          title="Salary Range"
          options={salaryOptions}
          value={filters.salary}
          onChange={(value) => handleFilterChange("salary", value)}
        />
      </div>
    </Card>
  );
};

export default JobFilters;