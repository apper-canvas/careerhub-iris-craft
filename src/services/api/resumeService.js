import resumesData from "@/services/mockData/resumes.json";

let resumes = [...resumesData];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const resumeService = {
  async getAll(userId = "user1") {
    await simulateDelay();
    return resumes
      .filter(resume => resume.userId === userId)
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .map(resume => ({ ...resume }));
  },

  async getById(id) {
    await simulateDelay();
    const resume = resumes.find(r => r.Id === parseInt(id));
    if (!resume) {
      throw new Error("Resume not found");
    }
    return { ...resume };
  },

  async create(resumeData) {
    await simulateDelay();
    const newResume = {
      ...resumeData,
      Id: Math.max(...resumes.map(r => r.Id)) + 1,
      userId: "user1",
      uploadDate: new Date().toISOString()
    };
    resumes.push(newResume);
    return { ...newResume };
  },

  async update(id, resumeData) {
    await simulateDelay();
    const index = resumes.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resume not found");
    }
    resumes[index] = { ...resumes[index], ...resumeData };
    return { ...resumes[index] };
  },

  async delete(id) {
    await simulateDelay();
    const index = resumes.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resume not found");
    }
    const deletedResume = resumes.splice(index, 1)[0];
    return { ...deletedResume };
  },

  async setDefault(id, userId = "user1") {
    await simulateDelay();
    
    // Remove default from all resumes
    resumes.forEach(resume => {
      if (resume.userId === userId) {
        resume.isDefault = false;
      }
    });
    
    // Set new default
    const index = resumes.findIndex(r => r.Id === parseInt(id) && r.userId === userId);
    if (index === -1) {
      throw new Error("Resume not found");
    }
    
    resumes[index].isDefault = true;
    return { ...resumes[index] };
  }
};