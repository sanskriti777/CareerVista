import "./RecentJobs.css";
import { jobs } from "../../data/jobsData";

function RecentJobs() {
  return (
    <div className="recent-jobs">
      <h2>Recent Jobs</h2>

      {jobs.map((job) => (
        <div className="job-item" key={job.id}>
          <h4>{job.title}</h4>

          <p>{job.company}</p>

          <span>{job.location}</span>
        </div>
      ))}
    </div>
  );
}

export default RecentJobs;