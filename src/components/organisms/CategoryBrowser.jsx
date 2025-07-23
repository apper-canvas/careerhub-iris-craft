import React from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const CategoryBrowser = ({ className }) => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Technology",
      icon: "Code",
      color: "from-blue-500 to-blue-600",
      jobs: 1250,
      description: "Software, AI, Web Development"
    },
    {
      name: "Finance",
      icon: "TrendingUp",
      color: "from-green-500 to-green-600",
      jobs: 850,
      description: "Banking, Investment, FinTech"
    },
    {
      name: "Healthcare",
      icon: "Heart",
      color: "from-red-500 to-red-600",
      jobs: 920,
      description: "Medical, Nursing, Research"
    },
    {
      name: "Marketing",
      icon: "Megaphone",
      color: "from-purple-500 to-purple-600",
      jobs: 680,
      description: "Digital, Content, Brand Strategy"
    },
    {
      name: "Education",
      icon: "GraduationCap",
      color: "from-indigo-500 to-indigo-600",
      jobs: 540,
      description: "Teaching, Training, EdTech"
    },
    {
      name: "Design",
      icon: "Palette",
      color: "from-pink-500 to-pink-600",
      jobs: 420,
      description: "UI/UX, Graphic, Product Design"
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/jobs?industry=${category.toLowerCase()}`);
  };

  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
            Browse by <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore opportunities across diverse industries and find your perfect match
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="cursor-pointer hover:scale-105 transition-all duration-300 group"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                  category.color
                )}>
                  <ApperIcon name={category.icon} className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {category.description}
                  </p>
                  <p className="text-sm font-medium text-primary-600">
                    {category.jobs.toLocaleString()} open positions
                  </p>
                </div>

                <ApperIcon
                  name="ArrowRight"
                  className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBrowser;