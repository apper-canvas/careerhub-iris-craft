import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const FilterGroup = ({ title, options, value, onChange, className, isCollapsible = true }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleOpen = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn("border-b border-gray-200 pb-4", className)}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center justify-between w-full text-left mb-3 hover:text-primary-600 transition-colors"
        disabled={!isCollapsible}
      >
        <Label className="mb-0 font-semibold text-gray-800">{title}</Label>
        {isCollapsible && (
          <ApperIcon
            name={isOpen ? "ChevronUp" : "ChevronDown"}
            className="w-4 h-4 text-gray-500"
          />
        )}
      </button>
      
      {isOpen && (
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        >
          <option value="">All {title}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default FilterGroup;