import "./Dashboard.css";
import { useState, useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import StatsCard from "../components/dashboard/StatsCard";
import RecentJobs from "../components/dashboard/RecentJobs";
import TrendingSkills from "../components/dashboard/TrendingSkills";
import RecommendedJobsSection from "../components/dashboard/RecommendedJobsSection";
import ApplyModal from "../components/jobs/ApplyModal";
import { useApplications } from "../context/ApplicationsContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../services/jobService";
import {
  getRecommendedJobs,
  hasSufficientProfileData,
} from "../utils/matchingEngine";

function Dashboard() {
  const { user } = useAuth();
  const { applications, loading: applicationsLoading } = useApplications();
  const { savedJobs, loading: savedJobsLoading } = useSavedJobs();

  const [jobs, setJobs] = useState([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardJobs = async () => {
      setJobsLoading(true);
      try {
        const response = await getJobs({ sort: "latest" });
        if (isMounted && response && response.success) {
          const fetchedJobs = response.jobs || [];
          setJobs(fetchedJobs);
          setJobsCount(
            typeof response.count === "number"
              ? response.count
              : fetchedJobs.length
          );
        }
      } catch (err) {
        console.error("Error fetching jobs for Dashboard:", err);
      } finally {
        if (isMounted) {
          setJobsLoading(false);
        }
      }
    };

    fetchDashboardJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute real deterministic job matches from live MongoDB jobs and user profile
  const hasProfile = hasSufficientProfileData(user);
  const recommendations = useMemo(() => {
    return getRecommendedJobs(user, jobs, 4);
  }, [user, jobs]);

  const topMatch = recommendations[0]?.match;

  const dynamicStats = [
    {
      title: "Available Jobs",
      value: jobsLoading ? "..." : String(jobsCount),
      color: "#5B21B6",
      trend: "Active openings",
    },
    {
      title: "Saved Jobs",
      value: savedJobsLoading ? "..." : String(savedJobs.length),
      color: "#2563EB",
      trend: "Active bookmarks",
    },
    {
      title: "Applications",
      value: applicationsLoading ? "..." : String(applications.length),
      color: "#16A34A",
      trend: "Tracked applications",
    },
    {
      title: "Career Match",
      value: jobsLoading
        ? "..."
        : hasProfile && topMatch
        ? `${topMatch.score}%`
        : "Profile setup",
      color: "#7C3AED",
      trend:
        hasProfile && topMatch
          ? `${topMatch.label} (Top)`
          : "Add skills to match",
    },
  ];

  return (
    <MainLayout>
      <Topbar />

      <div className="stats-grid">
        {dynamicStats.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            color={item.color}
            trend={item.trend}
          />
        ))}
      </div>

      {/* Recommended Jobs Section */}
      <RecommendedJobsSection
        recommendations={recommendations}
        loading={jobsLoading}
        hasProfile={hasProfile}
        onOpenApplyModal={(job) => setSelectedApplyJob(job)}
      />

      <div className="dashboard-grid">
        <RecentJobs jobs={jobs} loading={jobsLoading} />
        <TrendingSkills jobs={jobs} loading={jobsLoading} />
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

export default Dashboard;