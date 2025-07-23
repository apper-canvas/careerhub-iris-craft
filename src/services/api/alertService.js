export const alertService = {
  async getAll() {
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
          { field: { Name: "location_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "jobType_c" } },
          { field: { Name: "salary_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "isActive_c" } },
          { field: { Name: "matchCount_c" } },
          { field: { Name: "createdDate_c" } },
          { field: { Name: "lastChecked_c" } },
          { field: { Name: "lastModified_c" } }
        ],
        orderBy: [
          { fieldName: "createdDate_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("alert_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(alert => ({
        Id: alert.Id,
        name: alert.Name,
        title: alert.title_c,
        location: alert.location_c,
        industry: alert.industry_c,
        jobType: alert.jobType_c,
        salary: alert.salary_c,
        frequency: alert.frequency_c,
        isActive: alert.isActive_c,
        matchCount: alert.matchCount_c,
        createdDate: alert.createdDate_c,
        lastChecked: alert.lastChecked_c,
        lastModified: alert.lastModified_c
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching alerts:", error?.response?.data?.message);
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
          { field: { Name: "location_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "jobType_c" } },
          { field: { Name: "salary_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "isActive_c" } },
          { field: { Name: "matchCount_c" } },
          { field: { Name: "createdDate_c" } },
          { field: { Name: "lastChecked_c" } },
          { field: { Name: "lastModified_c" } }
        ]
      };

      const response = await apperClient.getRecordById("alert_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Alert not found");
      }

      const alert = response.data;
      return {
        Id: alert.Id,
        name: alert.Name,
        title: alert.title_c,
        location: alert.location_c,
        industry: alert.industry_c,
        jobType: alert.jobType_c,
        salary: alert.salary_c,
        frequency: alert.frequency_c,
        isActive: alert.isActive_c,
        matchCount: alert.matchCount_c,
        createdDate: alert.createdDate_c,
        lastChecked: alert.lastChecked_c,
        lastModified: alert.lastModified_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching alert with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Alert not found");
    }
  },

  async create(alertData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: alertData.name,
          Tags: alertData.Tags,
          Owner: alertData.Owner,
          title_c: alertData.title,
          location_c: alertData.location,
          industry_c: alertData.industry,
          jobType_c: alertData.jobType,
          salary_c: alertData.salary,
          frequency_c: alertData.frequency,
          isActive_c: true,
          matchCount_c: 0,
          createdDate_c: new Date().toISOString(),
          lastChecked_c: new Date().toISOString(),
          lastModified_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("alert_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create alert ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, alertData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id),
        lastModified_c: new Date().toISOString()
      };
      
      // Only include updateable fields
      if (alertData.name !== undefined) updateData.Name = alertData.name;
      if (alertData.Tags !== undefined) updateData.Tags = alertData.Tags;
      if (alertData.Owner !== undefined) updateData.Owner = alertData.Owner;
      if (alertData.title !== undefined) updateData.title_c = alertData.title;
      if (alertData.location !== undefined) updateData.location_c = alertData.location;
      if (alertData.industry !== undefined) updateData.industry_c = alertData.industry;
      if (alertData.jobType !== undefined) updateData.jobType_c = alertData.jobType;
      if (alertData.salary !== undefined) updateData.salary_c = alertData.salary;
      if (alertData.frequency !== undefined) updateData.frequency_c = alertData.frequency;
      if (alertData.isActive !== undefined) updateData.isActive_c = alertData.isActive;
      if (alertData.matchCount !== undefined) updateData.matchCount_c = alertData.matchCount;
      if (alertData.lastChecked !== undefined) updateData.lastChecked_c = alertData.lastChecked;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("alert_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update alert ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating alert:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("alert_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete alert ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async toggleActive(id) {
    try {
      // First get the current alert to toggle its active state
      const currentAlert = await this.getById(id);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          isActive_c: !currentAlert.isActive,
          lastModified_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("alert_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to toggle alert ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling alert status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};