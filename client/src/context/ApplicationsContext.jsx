import { createContext, useContext, useState, useEffect } from "react";

const ApplicationsContext = createContext();

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(() => {
    const stored = localStorage.getItem("jobApplications");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("jobApplications", JSON.stringify(applications));
  }, [applications]);

  const applyToJob = (job, formData) => {
    const newApplication = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      appliedDate: new Date().toLocaleDateString(),
      status: "Submitted",
      ...formData,
    };

    setApplications((prev) => [newApplication, ...prev]);
    return newApplication;
  };

  const hasApplied = (jobId) => {
    return applications.some((app) => app.jobId === jobId);
  };

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        applyToJob,
        hasApplied,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  return useContext(ApplicationsContext);
}
