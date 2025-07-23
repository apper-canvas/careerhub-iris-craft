export const applicationService = {
  async getAll(userId) {
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
          { field: { Name: "job_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "appliedDate_c" } },
          { field: { Name: "resume_id_c" } },
          { field: { Name: "coverLetter_c" } }
        ],
        orderBy: [
          { fieldName: "appliedDate_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("application_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(app => ({
        Id: app.Id,
        jobId: app.job_id_c?.Id || app.job_id_c,
        userId: app.user_id_c?.Id || app.user_id_c,
        status: app.status_c,
        appliedDate: app.appliedDate_c,
        resumeId: app.resume_id_c?.Id || app.resume_id_c,
        coverLetter: app.coverLetter_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications:", error?.response?.data?.message);
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
          { field: { Name: "job_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "appliedDate_c" } },
          { field: { Name: "resume_id_c" } },
          { field: { Name: "coverLetter_c" } }
        ]
      };

      const response = await apperClient.getRecordById("application_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Application not found");
      }

      const app = response.data;
      return {
        Id: app.Id,
        jobId: app.job_id_c?.Id || app.job_id_c,
        userId: app.user_id_c?.Id || app.user_id_c,
        status: app.status_c,
        appliedDate: app.appliedDate_c,
        resumeId: app.resume_id_c?.Id || app.resume_id_c,
        coverLetter: app.coverLetter_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching application with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Application not found");
    }
  },

  async create(applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Application for Job ${applicationData.jobId}`,
          Tags: applicationData.Tags,
          Owner: applicationData.Owner,
          job_id_c: parseInt(applicationData.jobId),
          user_id_c: applicationData.userId,
          status_c: "submitted",
          appliedDate_c: new Date().toISOString(),
          resume_id_c: parseInt(applicationData.resumeId),
          coverLetter_c: applicationData.coverLetter
        }]
      };

      const response = await apperClient.createRecord("application_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create application ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, applicationData) {
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
      if (applicationData.Name !== undefined) updateData.Name = applicationData.Name;
      if (applicationData.Tags !== undefined) updateData.Tags = applicationData.Tags;
      if (applicationData.Owner !== undefined) updateData.Owner = applicationData.Owner;
      if (applicationData.jobId !== undefined) updateData.job_id_c = parseInt(applicationData.jobId);
      if (applicationData.userId !== undefined) updateData.user_id_c = applicationData.userId;
      if (applicationData.status !== undefined) updateData.status_c = applicationData.status;
      if (applicationData.appliedDate !== undefined) updateData.appliedDate_c = applicationData.appliedDate;
      if (applicationData.resumeId !== undefined) updateData.resume_id_c = parseInt(applicationData.resumeId);
      if (applicationData.coverLetter !== undefined) updateData.coverLetter_c = applicationData.coverLetter;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("application_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update application ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("application_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete application ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};