import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { name: "Browse Jobs", href: "/jobs", icon: "Search" },
    { name: "My Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Saved Jobs", href: "/saved-jobs", icon: "Heart" },
    { name: "Applications", href: "/applications", icon: "FileText" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              CareerHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                  isActivePath(item.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/resumes")}
            >
              <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/jobs")}
            >
              Find Jobs
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
          >
            <ApperIcon
              name={isMobileMenuOpen ? "X" : "Menu"}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
                  isActivePath(item.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/resumes");
                  setIsMobileMenuOpen(false);
                }}
              >
                <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
              <Button
                className="w-full justify-start"
                onClick={() => {
                  navigate("/jobs");
                  setIsMobileMenuOpen(false);
                }}
              >
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;