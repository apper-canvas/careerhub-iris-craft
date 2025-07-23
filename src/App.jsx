import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import HomePage from "@/components/pages/HomePage";
import JobListingsPage from "@/components/pages/JobListingsPage";
import JobDetailPage from "@/components/pages/JobDetailPage";
import DashboardPage from "@/components/pages/DashboardPage";
import SavedJobsPage from "@/components/pages/SavedJobsPage";
import ApplicationsPage from "@/components/pages/ApplicationsPage";
import ResumesPage from "@/components/pages/ResumesPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListingsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/saved-jobs" element={<SavedJobsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;