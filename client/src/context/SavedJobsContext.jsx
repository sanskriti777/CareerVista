import { createContext, useContext, useState, useEffect } from "react";

const SavedJobsContext = createContext();

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState(() => {
    const storedJobs = localStorage.getItem("savedJobs");
    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  const toggleSaveJob = (id) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((jobId) => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };
  useEffect(() => {
    localStorage.setItem("savedJobs",JSON.stringify(savedJobs)
    );
  }, [savedJobs]);

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        toggleSaveJob,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  return useContext(SavedJobsContext);
}