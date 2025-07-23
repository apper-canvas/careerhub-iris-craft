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
  },

  async getProfile(id) {
    await simulateDelay();
    const resume = resumes.find(r => r.Id === parseInt(id));
    if (!resume) {
      throw new Error("Resume not found");
    }
if (!resume.profile) {
      throw new Error("Profile data not available for this resume");
    }
    return { ...resume.profile };
  },
  async download(id) {
    await simulateDelay();
    const resume = resumes.find(r => r.Id === parseInt(id));
    if (!resume) {
      throw new Error("Resume not found");
    }
    
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
  }
};