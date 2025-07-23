export const resumeService = {
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
          { field: { Name: "user_id_c" } },
          { field: { Name: "filename_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "fileUrl_c" } },
          { field: { Name: "isDefault_c" } },
          { field: { Name: "profile_c" } }
        ],
        orderBy: [
          { fieldName: "uploadDate_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("resume_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(resume => ({
        Id: resume.Id,
        userId: resume.user_id_c?.Id || resume.user_id_c,
        filename: resume.filename_c || resume.Name,
        uploadDate: resume.uploadDate_c,
        fileUrl: resume.fileUrl_c,
        isDefault: resume.isDefault_c,
        profile: resume.profile_c ? JSON.parse(resume.profile_c) : null
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching resumes:", error?.response?.data?.message);
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
          { field: { Name: "user_id_c" } },
          { field: { Name: "filename_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "fileUrl_c" } },
          { field: { Name: "isDefault_c" } },
          { field: { Name: "profile_c" } }
        ]
      };

      const response = await apperClient.getRecordById("resume_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Resume not found");
      }

      const resume = response.data;
      return {
        Id: resume.Id,
        userId: resume.user_id_c?.Id || resume.user_id_c,
        filename: resume.filename_c || resume.Name,
        uploadDate: resume.uploadDate_c,
        fileUrl: resume.fileUrl_c,
        isDefault: resume.isDefault_c,
        profile: resume.profile_c ? JSON.parse(resume.profile_c) : null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching resume with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Resume not found");
    }
  },

  async create(resumeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: resumeData.filename,
          Tags: resumeData.Tags,
          Owner: resumeData.Owner,
          user_id_c: resumeData.userId,
          filename_c: resumeData.filename,
          uploadDate_c: new Date().toISOString(),
          fileUrl_c: resumeData.fileUrl,
          isDefault_c: resumeData.isDefault || false,
          profile_c: resumeData.profile ? JSON.stringify(resumeData.profile) : null
        }]
      };

      const response = await apperClient.createRecord("resume_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create resume ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating resume:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, resumeData) {
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
      if (resumeData.Name !== undefined) updateData.Name = resumeData.Name;
      if (resumeData.Tags !== undefined) updateData.Tags = resumeData.Tags;
      if (resumeData.Owner !== undefined) updateData.Owner = resumeData.Owner;
      if (resumeData.userId !== undefined) updateData.user_id_c = resumeData.userId;
      if (resumeData.filename !== undefined) updateData.filename_c = resumeData.filename;
      if (resumeData.uploadDate !== undefined) updateData.uploadDate_c = resumeData.uploadDate;
      if (resumeData.fileUrl !== undefined) updateData.fileUrl_c = resumeData.fileUrl;
      if (resumeData.isDefault !== undefined) updateData.isDefault_c = resumeData.isDefault;
      if (resumeData.profile !== undefined) updateData.profile_c = resumeData.profile ? JSON.stringify(resumeData.profile) : null;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("resume_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update resume ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating resume:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("resume_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete resume ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting resume:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async setDefault(id, userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, get all resumes to clear defaults
      const allResumes = await this.getAll(userId);
      const updateRecords = [];

      // Clear default from all resumes
      allResumes.forEach(resume => {
        updateRecords.push({
          Id: resume.Id,
          isDefault_c: resume.Id === parseInt(id)
        });
      });

      const params = {
        records: updateRecords
      };

      const response = await apperClient.updateRecord("resume_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Return the updated default resume
      return await this.getById(id);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error setting default resume:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getProfile(id) {
    try {
      const resume = await this.getById(id);
      if (!resume.profile) {
        throw new Error("Profile data not available for this resume");
      }
      return resume.profile;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching resume profile:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async download(id) {
    try {
      const resume = await this.getById(id);
      
      // Create a mock PDF content for demonstration
      const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Resume: ${resume.filename}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;

      // Create blob and trigger download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.filename.endsWith('.pdf') ? resume.filename : `${resume.filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename: resume.filename };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error downloading resume:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};