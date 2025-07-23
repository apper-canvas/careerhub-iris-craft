import alertsData from "@/services/mockData/alerts.json";

let alerts = [...alertsData];
let nextId = Math.max(...alerts.map(alert => alert.Id)) + 1;

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const alertService = {
  async getAll() {
    await simulateDelay();
    return [...alerts];
  },

  async getById(id) {
    await simulateDelay();
    const alert = alerts.find(a => a.Id === parseInt(id));
    if (!alert) {
      throw new Error("Alert not found");
    }
    return { ...alert };
  },

  async create(alertData) {
    await simulateDelay();
    const newAlert = {
      ...alertData,
      Id: nextId++,
      createdDate: new Date().toISOString(),
      isActive: true,
      matchCount: 0,
      lastChecked: new Date().toISOString()
    };
    alerts.push(newAlert);
    return { ...newAlert };
  },

  async update(id, alertData) {
    await simulateDelay();
    const index = alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    alerts[index] = { 
      ...alerts[index], 
      ...alertData,
      lastModified: new Date().toISOString()
    };
    return { ...alerts[index] };
  },

  async delete(id) {
    await simulateDelay();
    const index = alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    const deletedAlert = alerts.splice(index, 1)[0];
    return { ...deletedAlert };
  },

  async toggleActive(id) {
    await simulateDelay();
    const index = alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    alerts[index].isActive = !alerts[index].isActive;
    alerts[index].lastModified = new Date().toISOString();
    return { ...alerts[index] };
  }
};