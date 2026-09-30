import "./SavedJobs.css";
import { useEffect } from "react";

import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import SavedJobCard from "../components/savedJobs/SavedJobCard";

import { useSavedJobs } from "../context/SavedJobsContext";

function SavedJobs() {
  const { savedJobsList, loading, error, toggleSaveJob, refreshSavedJobs } = useSavedJobs();

  useEffect(() => {
    if (refreshSavedJobs) {
      refreshSavedJobs();
    }
  }, [refreshSavedJobs]);

  return (
    <MainLayout>
      <Topbar />

      <h2 className="saved-title">Saved Jobs</h2>

      <div className="saved-jobs-grid">
        {loading ? (
          <h2 style={{ gridColumn: "1 / -1", textAlign: "center", color: "#64748b" }}>
            Loading saved jobs...
          </h2>
        ) : error ? (
          <h2 style={{ gridColumn: "1 / -1", textAlign: "center", color: "#ef4444" }}>
            {error}
          </h2>
        ) : savedJobsList && savedJobsList.length > 0 ? (
          savedJobsList.map((item) => {
            const job = item.job;
            if (!job) return null;
            return (
              <SavedJobCard
                key={job._id || job.id}
                job={job}
                toggleSaveJob={() => toggleSaveJob(job._id || job.id)}
              />
            );
          })
        ) : (
          <h2>No Saved Jobs</h2>
        )}
      </div>
    </MainLayout>
  );
}

export default SavedJobs;