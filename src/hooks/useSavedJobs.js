import { useState, useEffect } from "react";

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("careerhub_saved_jobs");
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const saveJob = (jobId) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem("careerhub_saved_jobs", JSON.stringify(newSavedJobs));
  };

  const isSaved = (jobId) => savedJobs.includes(jobId);

  return {
    savedJobs,
    saveJob,
    isSaved
  };
};