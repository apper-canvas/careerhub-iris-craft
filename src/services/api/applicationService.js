import applicationsData from "@/services/mockData/applications.json";

let applications = [...applicationsData];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const applicationService = {
  async getAll(userId = "user1") {
    await simulateDelay();
    return applications
      .filter(app => app.userId === userId)
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
      .map(app => ({ ...app }));
  },

  async getById(id) {
    await simulateDelay();
    const application = applications.find(a => a.Id === parseInt(id));
    if (!application) {
      throw new Error("Application not found");
    }
    return { ...application };
  },

  async create(applicationData) {
    await simulateDelay();
    const newApplication = {
      ...applicationData,
      Id: Math.max(...applications.map(a => a.Id)) + 1,
      userId: "user1",
      status: "submitted",
      appliedDate: new Date().toISOString()
    };
    applications.push(newApplication);
    return { ...newApplication };
  },

  async update(id, applicationData) {
    await simulateDelay();
    const index = applications.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    applications[index] = { ...applications[index], ...applicationData };
    return { ...applications[index] };
  },

  async delete(id) {
    await simulateDelay();
    const index = applications.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    const deletedApplication = applications.splice(index, 1)[0];
    return { ...deletedApplication };
  }
};