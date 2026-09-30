import "./Jobs.css";
import { useState, useEffect } from "react";

import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import SearchBar from "../components/jobs/SearchBar";
import FilterPanel from "../components/jobs/FilterPanel";
import JobCard from "../components/jobs/JobCard";
import ApplyModal from "../components/jobs/ApplyModal";

import { getJobs } from "../services/jobService";
import { useSavedJobs } from "../context/SavedJobsContext";

function Jobs() {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  const { savedJobs, toggleSaveJob, refreshSavedJobs } = useSavedJobs();

  useEffect(() => {
    if (refreshSavedJobs) {
      refreshSavedJobs();
    }
  }, [refreshSavedJobs]);

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExperience("");
    setSortBy("latest");
  };

  // Fetch jobs from backend API with debounced search & filter criteria
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      const response = await getJobs({
        search,
        location,
        type: jobType,
        experience,
        sort: sortBy,
      });

      if (!isMounted) return;

      if (response.success) {
        setJobsList(response.jobs || []);
      } else {
        setError(response.message || "Unable to load jobs. Please try again.");
      }
      setLoading(false);
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [search, location, jobType, experience, sortBy]);

  return (
    <MainLayout>
      <Topbar />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="jobs-container">
        <div className="filter-section">
          <FilterPanel
            location={location}
            setLocation={setLocation}
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={handleResetFilters}
          />
        </div>

        <div className="jobs-grid">
          {loading ? (
            <div className="jobs-status-message">
              <h2>Loading jobs...</h2>
            </div>
          ) : error ? (
            <div className="jobs-status-message">
              <h2>{error}</h2>
            </div>
          ) : jobsList.length > 0 ? (
            jobsList.map((job) => (
              <JobCard
                key={job._id || job.id}
                job={job}
                savedJobs={savedJobs}
                toggleSaveJob={toggleSaveJob}
                onOpenApplyModal={(targetJob) => setSelectedApplyJob(targetJob)}
              />
            ))
          ) : (
            <div className="jobs-status-message">
              <h2>No jobs found matching your criteria.</h2>
            </div>
          )}
        </div>
      </div>

      {selectedApplyJob && (
        <ApplyModal
          job={selectedApplyJob}
          onClose={() => setSelectedApplyJob(null)}
        />
      )}
    </MainLayout>
  );
}

export default Jobs;