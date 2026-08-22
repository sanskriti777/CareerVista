import "./Dashboard.css";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import StatsCard from "../components/dashboard/StatsCard";
import RecentJobs from "../components/dashboard/RecentJobs";
import TrendingSkills from "../components/dashboard/TrendingSkills";
import { dashboardStats } from "../data/dashboardData";
import { useApplications } from "../context/ApplicationsContext";
import { useSavedJobs } from "../context/SavedJobsContext";

function Dashboard() {
  const { applications } = useApplications();
  const { savedJobs } = useSavedJobs();

  const dynamicStats = dashboardStats.map((item) => {
    if (item.title === "Applications") {
      return { ...item, value: 14 + applications.length };
    }
    if (item.title === "Saved Jobs") {
      return { ...item, value: savedJobs.length };
    }
    return item;
  });

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
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <RecentJobs />
        <TrendingSkills />
      </div>
    </MainLayout>
  );
}

export default Dashboard;