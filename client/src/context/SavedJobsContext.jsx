import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSavedJobs, saveJob, unsaveJob } from "../services/savedJobService";

const SavedJobsContext = createContext();

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState([]); // Array of string job IDs for heart toggles and counts
  const [savedJobsList, setSavedJobsList] = useState([]); // Array of populated saved job objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedJobs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSavedJobs([]);
      setSavedJobsList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getSavedJobs();
    if (response.success && Array.isArray(response.savedJobs)) {
      setSavedJobsList(response.savedJobs);
      const ids = response.savedJobs
        .map((item) => (item.job ? item.job._id || item.job.id : null))
        .filter(Boolean);
      setSavedJobs(ids);
    } else {
      if (response.message !== "No authentication token found") {
        setError(response.message || "Failed to load saved jobs");
      }
      setSavedJobs([]);
      setSavedJobsList([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSavedJobs();

    // Listen for auth state changes or window storage events
    const handleAuthChange = () => {
      fetchSavedJobs();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [fetchSavedJobs]);

  const toggleSaveJob = async (jobId, targetJobObj = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save jobs");
      return;
    }

    const isAlreadySaved = savedJobs.includes(jobId);

    if (isAlreadySaved) {
      // Optimistic remove
      const previousIds = [...savedJobs];
      const previousList = [...savedJobsList];

      setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      setSavedJobsList((prev) =>
        prev.filter(
          (item) =>
            item.job &&
            item.job._id !== jobId &&
            item.job.id !== jobId
        )
      );

      const result = await unsaveJob(jobId);
      if (!result.success && result.status !== 404) {
        // Rollback state if unsave failed
        setSavedJobs(previousIds);
        setSavedJobsList(previousList);
        console.error("Failed to unsave job:", result.message);
      }
    } else {
      // Optimistic add
      const previousIds = [...savedJobs];
      setSavedJobs((prev) => [...prev, jobId]);

      const result = await saveJob(jobId);
      if (result.success) {
        // Refresh full populated list from backend
        fetchSavedJobs();
      } else if (result.status === 409) {
        // 409 Conflict: already saved, keep in array
        setSavedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
      } else {
        // Rollback state on error
        setSavedJobs(previousIds);
        console.error("Failed to save job:", result.message);
      }
    }
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        savedJobsList,
        loading,
        error,
        toggleSaveJob,
        refreshSavedJobs: fetchSavedJobs,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  return useContext(SavedJobsContext);
}