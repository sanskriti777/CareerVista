import "./Jobs.css";
import { useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import SearchBar from "../components/jobs/SearchBar";
import FilterPanel from "../components/jobs/FilterPanel";
import JobCard from "../components/jobs/JobCard";
import ApplyModal from "../components/jobs/ApplyModal";

import { jobs } from "../data/jobsData";
import { useSavedJobs } from "../context/SavedJobsContext";

function Jobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  const { savedJobs, toggleSaveJob } = useSavedJobs();

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExperience("");
    setSortBy("latest");
  };

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

    const matchesLocation = location === "" || job.location === location;
    const matchesJobType = jobType === "" || job.type === jobType;
    const matchesExp = experience === "" || job.experience === experience;

    return matchesSearch && matchesLocation && matchesJobType && matchesExp;
  }).sort((a, b) => {
    if (sortBy === "salary-high") {
      const getSalaryVal = (s) => Number(s.replace(/[^0-9]/g, "")) || 0;
      return getSalaryVal(b.salary) - getSalaryVal(a.salary);
    }
    if (sortBy === "company-az") {
      return a.company.localeCompare(b.company);
    }
    return a.id - b.id;
  });

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
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedJobs={savedJobs}
                toggleSaveJob={toggleSaveJob}
                onOpenApplyModal={(targetJob) => setSelectedApplyJob(targetJob)}
              />
            ))
          ) : (
            <h2>No jobs found matching your criteria.</h2>
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