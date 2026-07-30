import "./SavedJobs.css";

import MainLayout from "../layouts/MainLayout";
import SavedJobCard from "../components/savedJobs/SavedJobCard";

import { jobs } from "../data/jobsData";
import { useSavedJobs } from "../context/SavedJobsContext";

function SavedJobs() {
  const { savedJobs } = useSavedJobs();

  const savedJobList = jobs.filter((job) =>
    savedJobs.includes(job.id)
  );

  return (
    <MainLayout>
      <h1 className="saved-title">Saved Jobs</h1>

      <div className="saved-jobs-grid">
        {savedJobList.length > 0 ? (
          savedJobList.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
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