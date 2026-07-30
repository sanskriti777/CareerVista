import "./Dashboard.css";
import MainLayout from "../layouts/MainLayout";
import Topbar from "../components/dashboard/Topbar";
import StatsCard from "../components/dashboard/StatsCard";
import RecentJobs from "../components/dashboard/RecentJobs";
import TrendingSkills from "../components/dashboard/TrendingSkills";
import { dashboardStats } from "../data/dashboardData";

function Dashboard() {
  return (
    <MainLayout>
      <Topbar />

      <div className="stats-grid">
        {dashboardStats.map((item, index) => (
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