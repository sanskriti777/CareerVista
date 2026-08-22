import "./SavedJobs.css";

import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import SavedJobCard from "../components/savedJobs/SavedJobCard";

import { jobs } from "../data/jobsData";
import { useSavedJobs } from "../context/SavedJobsContext";

function SavedJobs() {
  const { savedJobs, toggleSaveJob } = useSavedJobs();

  const savedJobList = jobs.filter((job) =>
    savedJobs.includes(job.id)
  );

  return (
    <MainLayout>
      <Topbar />

      <h2 className="saved-title">Saved Jobs</h2>

      <div className="saved-jobs-grid">
        {savedJobList.length > 0 ? (
          savedJobList.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              toggleSaveJob={toggleSaveJob}
            />
          ))
        ) : (
          <h2>No Saved Jobs</h2>
        )}
      </div>
    </MainLayout>
  );
}

export default SavedJobs;