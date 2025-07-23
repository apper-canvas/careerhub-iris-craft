import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ className, placeholder = "Search for jobs...", onSearch, ...props }) => {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex gap-3 w-full max-w-2xl", className)}
      {...props}
    >
      <div className="flex-1 relative">
        <ApperIcon
          name="Search"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          className="pl-12 h-14 text-lg shadow-lg border-2 focus:border-primary-500"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-14 px-8 shadow-lg"
      >
        <ApperIcon name="Search" className="w-5 h-5 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;