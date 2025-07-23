import jobsData from "@/services/mockData/jobs.json";

let jobs = [...jobsData];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const jobService = {
  async getAll(filters = {}) {
    await simulateDelay();
    
    let filteredJobs = [...jobs];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.industry) {
      filteredJobs = filteredJobs.filter(job => 
        job.industry === filters.industry
      );
    }
    
    if (filters.jobType) {
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase().replace(" ", "-") === filters.jobType
      );
    }
    
    if (filters.salary) {
      const [min, max] = filters.salary.split("-").map(s => parseInt(s.replace("+", "")));
      filteredJobs = filteredJobs.filter(job => {
        if (!job.salary || !job.salary.min) return false;
        if (max) {
          return job.salary.min >= min && job.salary.min <= max;
        } else {
          return job.salary.min >= min;
        }
      });
    }
    
    // Sort by posted date (newest first)
    filteredJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    
    return filteredJobs;
  },

  async getById(id) {
    await simulateDelay();
    const job = jobs.find(j => j.Id === parseInt(id));
    if (!job) {
      throw new Error("Job not found");
    }
    return { ...job };
  },

  async getFeatured() {
    await simulateDelay();
    return jobs.filter(job => job.featured).slice(0, 6).map(job => ({ ...job }));
  },

  async create(jobData) {
    await simulateDelay();
    const newJob = {
      ...jobData,
      Id: Math.max(...jobs.map(j => j.Id)) + 1,
      posted: new Date().toISOString(),
      featured: false
    };
    jobs.push(newJob);
    return { ...newJob };
  },

  async update(id, jobData) {
    await simulateDelay();
    const index = jobs.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    jobs[index] = { ...jobs[index], ...jobData };
    return { ...jobs[index] };
  },

  async delete(id) {
    await simulateDelay();
    const index = jobs.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
const deletedJob = jobs.splice(index, 1)[0];
    return { ...deletedJob };
  },

  async getMatchingJobs(alertCriteria) {
    await simulateDelay();
    let matchingJobs = [...jobs];
    
    // Apply alert criteria filters
    if (alertCriteria.title) {
      const titleTerm = alertCriteria.title.toLowerCase();
      matchingJobs = matchingJobs.filter(job => 
        job.title.toLowerCase().includes(titleTerm)
      );
    }
    
    if (alertCriteria.location) {
      matchingJobs = matchingJobs.filter(job => 
        job.location.toLowerCase().includes(alertCriteria.location.toLowerCase())
      );
    }
    
    if (alertCriteria.industry) {
      matchingJobs = matchingJobs.filter(job => 
        job.industry === alertCriteria.industry
      );
    }
    
    if (alertCriteria.jobType) {
      matchingJobs = matchingJobs.filter(job => 
        job.type.toLowerCase().replace(" ", "-") === alertCriteria.jobType
      );
    }
    
    if (alertCriteria.salary) {
      const [min, max] = alertCriteria.salary.split("-").map(s => parseInt(s.replace("+", "")));
      matchingJobs = matchingJobs.filter(job => {
        if (!job.salary || !job.salary.min) return false;
        if (max) {
          return job.salary.min >= min && job.salary.min <= max;
        } else {
          return job.salary.min >= min;
        }
      });
    }
    
    // Sort by posted date (newest first)
    matchingJobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    
    return matchingJobs;
  }
};