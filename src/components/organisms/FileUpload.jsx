import React from "react";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FileUpload = ({ onFileUpload, acceptedTypes = ".pdf,.doc,.docx", className }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    const file = files[0];
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const resume = {
        Id: Date.now(),
        filename: file.name,
        uploadDate: new Date().toISOString(),
        fileUrl: URL.createObjectURL(file),
        isDefault: false,
      };

      onFileUpload?.(resume);
      toast.success("Resume uploaded successfully!");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-all duration-300 cursor-pointer",
        isDragOver
          ? "border-primary-500 bg-primary-50"
          : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
        isUploading && "pointer-events-none opacity-60",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center py-12">
        {isUploading ? (
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ApperIcon name="Upload" className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading Resume...</h3>
            <p className="text-gray-600">Please wait while we process your file</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Upload" className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-gray-600 mb-4">
              Drag & drop your resume here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports PDF, DOC, DOCX files up to 10MB
            </p>
            <Button>
              <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;