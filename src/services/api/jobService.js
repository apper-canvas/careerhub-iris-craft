export const jobService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "salary_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "requirements_c" } },
          { field: { Name: "benefits_c" } },
          { field: { Name: "posted_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "featured_c" } }
        ],
        orderBy: [
          { fieldName: "posted_c", sorttype: "DESC" }
        ]
      };

      // Apply filters
      let whereConditions = [];
      
      if (filters.search) {
        whereConditions.push({
          fieldName: "title_c",
          operator: "Contains",
          values: [filters.search]
        });
      }
      
      if (filters.location) {
        whereConditions.push({
          fieldName: "location_c",
          operator: "Contains",
          values: [filters.location]
        });
      }
      
      if (filters.industry) {
        whereConditions.push({
          fieldName: "industry_c",
          operator: "EqualTo",
          values: [filters.industry]
        });
      }
      
      if (filters.jobType) {
        whereConditions.push({
          fieldName: "type_c",
          operator: "EqualTo",
          values: [filters.jobType.replace("-", " ")]
        });
      }
      
      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }

      const response = await apperClient.fetchRecords("job_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(job => ({
        Id: job.Id,
        title: job.title_c || job.Name,
        company: job.company_c,
        location: job.location_c,
        type: job.type_c,
        salary: job.salary_c ? { min: parseInt(job.salary_c.split('-')[0] || 0), max: parseInt(job.salary_c.split('-')[1] || 0) } : null,
        description: job.description_c,
        requirements: job.requirements_c ? job.requirements_c.split('\n') : [],
        benefits: job.benefits_c ? job.benefits_c.split('\n') : [],
        posted: job.posted_c,
        deadline: job.deadline_c,
        industry: job.industry_c,
        featured: job.featured_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching jobs:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "salary_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "requirements_c" } },
          { field: { Name: "benefits_c" } },
          { field: { Name: "posted_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "featured_c" } }
        ]
      };

      const response = await apperClient.getRecordById("job_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Job not found");
      }

      const job = response.data;
      return {
        Id: job.Id,
        title: job.title_c || job.Name,
        company: job.company_c,
        location: job.location_c,
        type: job.type_c,
        salary: job.salary_c ? { min: parseInt(job.salary_c.split('-')[0] || 0), max: parseInt(job.salary_c.split('-')[1] || 0) } : null,
        description: job.description_c,
        requirements: job.requirements_c ? job.requirements_c.split('\n') : [],
        benefits: job.benefits_c ? job.benefits_c.split('\n') : [],
        posted: job.posted_c,
        deadline: job.deadline_c,
        industry: job.industry_c,
        featured: job.featured_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching job with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Job not found");
    }
  },

  async getFeatured() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "salary_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "requirements_c" } },
          { field: { Name: "benefits_c" } },
          { field: { Name: "posted_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "featured_c" } }
        ],
        where: [
          { fieldName: "featured_c", operator: "EqualTo", values: [true] }
        ],
        orderBy: [
          { fieldName: "posted_c", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 6, offset: 0 }
      };

      const response = await apperClient.fetchRecords("job_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(job => ({
        Id: job.Id,
        title: job.title_c || job.Name,
        company: job.company_c,
        location: job.location_c,
        type: job.type_c,
        salary: job.salary_c ? { min: parseInt(job.salary_c.split('-')[0] || 0), max: parseInt(job.salary_c.split('-')[1] || 0) } : null,
        description: job.description_c,
        requirements: job.requirements_c ? job.requirements_c.split('\n') : [],
        benefits: job.benefits_c ? job.benefits_c.split('\n') : [],
        posted: job.posted_c,
        deadline: job.deadline_c,
        industry: job.industry_c,
        featured: job.featured_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured jobs:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: jobData.title || jobData.Name,
          Tags: jobData.Tags,
          Owner: jobData.Owner,
          title_c: jobData.title,
          company_c: jobData.company,
          location_c: jobData.location,
          type_c: jobData.type,
          salary_c: jobData.salary,
          description_c: jobData.description,
          requirements_c: Array.isArray(jobData.requirements) ? jobData.requirements.join('\n') : jobData.requirements,
          benefits_c: Array.isArray(jobData.benefits) ? jobData.benefits.join('\n') : jobData.benefits,
          posted_c: new Date().toISOString(),
          deadline_c: jobData.deadline,
          industry_c: jobData.industry,
          featured_c: jobData.featured || false
        }]
      };

      const response = await apperClient.createRecord("job_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create job ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating job:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (jobData.Name !== undefined) updateData.Name = jobData.Name;
      if (jobData.Tags !== undefined) updateData.Tags = jobData.Tags;
      if (jobData.Owner !== undefined) updateData.Owner = jobData.Owner;
      if (jobData.title !== undefined) updateData.title_c = jobData.title;
      if (jobData.company !== undefined) updateData.company_c = jobData.company;
      if (jobData.location !== undefined) updateData.location_c = jobData.location;
      if (jobData.type !== undefined) updateData.type_c = jobData.type;
      if (jobData.salary !== undefined) updateData.salary_c = jobData.salary;
      if (jobData.description !== undefined) updateData.description_c = jobData.description;
      if (jobData.requirements !== undefined) updateData.requirements_c = Array.isArray(jobData.requirements) ? jobData.requirements.join('\n') : jobData.requirements;
      if (jobData.benefits !== undefined) updateData.benefits_c = Array.isArray(jobData.benefits) ? jobData.benefits.join('\n') : jobData.benefits;
      if (jobData.deadline !== undefined) updateData.deadline_c = jobData.deadline;
      if (jobData.industry !== undefined) updateData.industry_c = jobData.industry;
      if (jobData.featured !== undefined) updateData.featured_c = jobData.featured;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("job_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update job ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating job:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("job_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete job ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting job:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getMatchingJobs(alertCriteria) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "salary_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "requirements_c" } },
          { field: { Name: "benefits_c" } },
          { field: { Name: "posted_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "featured_c" } }
        ],
        orderBy: [
          { fieldName: "posted_c", sorttype: "DESC" }
        ]
      };

      // Apply alert criteria filters
      let whereConditions = [];
      
      if (alertCriteria.title_c) {
        whereConditions.push({
          fieldName: "title_c",
          operator: "Contains",
          values: [alertCriteria.title_c]
        });
      }
      
      if (alertCriteria.location_c) {
        whereConditions.push({
          fieldName: "location_c",
          operator: "Contains",
          values: [alertCriteria.location_c]
        });
      }
      
      if (alertCriteria.industry_c) {
        whereConditions.push({
          fieldName: "industry_c",
          operator: "EqualTo",
          values: [alertCriteria.industry_c]
        });
      }
      
      if (alertCriteria.jobType_c) {
        whereConditions.push({
          fieldName: "type_c",
          operator: "EqualTo",
          values: [alertCriteria.jobType_c.replace("-", " ")]
        });
      }
      
      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }

      const response = await apperClient.fetchRecords("job_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(job => ({
        Id: job.Id,
        title: job.title_c || job.Name,
        company: job.company_c,
        location: job.location_c,
        type: job.type_c,
        salary: job.salary_c ? { min: parseInt(job.salary_c.split('-')[0] || 0), max: parseInt(job.salary_c.split('-')[1] || 0) } : null,
        description: job.description_c,
        requirements: job.requirements_c ? job.requirements_c.split('\n') : [],
        benefits: job.benefits_c ? job.benefits_c.split('\n') : [],
        posted: job.posted_c,
        deadline: job.deadline_c,
        industry: job.industry_c,
        featured: job.featured_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching matching jobs:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};