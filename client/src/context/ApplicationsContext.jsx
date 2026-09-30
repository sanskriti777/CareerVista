import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getApplications,
  applyToJob as apiApplyToJob,
  withdrawApplication as apiWithdrawApplication,
} from "../services/applicationService";
import { useAuth } from "./AuthContext";

const ApplicationsContext = createContext();

export function ApplicationsProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshApplications = useCallback(async () => {
    if (!isAuthenticated) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getApplications();

      if (response && response.success) {
        setApplications(Array.isArray(response.applications) ? response.applications : []);
      } else {
        setError(response?.message || "Failed to load applications");
      }
    } catch (err) {
      console.error("Error in refreshApplications:", err);
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setApplications([]);
      setLoading(false);
      setError(null);
      return;
    }

    refreshApplications();
  }, [authLoading, isAuthenticated, user?._id, refreshApplications]);

  const applyToJob = async (job, formData) => {
    const jobId = job?._id || job?.id;

    if (!jobId) {
      return {
        success: false,
        message: "Invalid job identifier",
        status: 400,
      };
    }

    try {
      const response = await apiApplyToJob(jobId, formData);

      if (response && response.success && response.application) {
        setApplications((prev) => [response.application, ...prev]);
        return {
          success: true,
          application: response.application,
        };
      }

      if (response && response.status === 409) {
        return {
          success: false,
          message: response.message || "You have already applied for this role",
          status: 409,
        };
      }

      return {
        success: false,
        message: response?.message || "Unable to submit application",
        status: response?.status || 500,
      };
    } catch (err) {
      console.error("Error in applyToJob:", err);
      return {
        success: false,
        message: "Unable to connect to server. Please try again later.",
        status: 500,
      };
    }
  };

  const hasApplied = (jobId) => {
    if (!jobId) return false;
    return applications.some((app) => {
      const targetJobId = app.job?._id || app.job || app.jobId;
      return String(targetJobId) === String(jobId);
    });
  };

  const withdrawApplication = async (applicationId) => {
    if (!applicationId) {
      return {
        success: false,
        message: "Application ID is required",
        status: 400,
      };
    }

    try {
      const response = await apiWithdrawApplication(applicationId);

      if (response && response.success) {
        setApplications((prev) =>
          prev.filter(
            (app) => String(app._id || app.id) !== String(applicationId)
          )
        );
        return response;
      }

      return {
        success: false,
        message: response?.message || "Failed to withdraw application",
        status: response?.status || 500,
      };
    } catch (err) {
      console.error("Error in withdrawApplication:", err);
      return {
        success: false,
        message: "Unable to connect to server. Please try again later.",
        status: 500,
      };
    }
  };

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        loading,
        error,
        applyToJob,
        hasApplied,
        refreshApplications,
        withdrawApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error("useApplications must be used within an ApplicationsProvider");
  }
  return context;
}
