import "./Jobs.css";
import { useState } from "react";

import MainLayout from "../layouts/MainLayout";
import SearchBar from "../components/jobs/SearchBar";
import FilterPanel from "../components/jobs/FilterPanel";
import JobCard from "../components/jobs/JobCard";

import { jobs } from "../data/jobsData";
import { useSavedJobs } from "../context/SavedJobsContext";

function Jobs() {
  // Search State
  const [search, setSearch] = useState("");

  // Filter States
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  // Global Saved Jobs Context
  const { savedJobs, toggleSaveJob } = useSavedJobs();

  // Search + Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.location.toLowerCase().includes(keyword) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(keyword)
      );

    const matchesLocation =
      location === "" || job.location === location;

    const matchesJobType =
      jobType === "" || job.type === jobType;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType
    );
  });

  return (
    <MainLayout>
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
          />
        </div>

        <div className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedJobs={savedJobs}
                toggleSaveJob={toggleSaveJob}
              />
            ))
          ) : (
            <h2>No jobs found.</h2>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Jobs;