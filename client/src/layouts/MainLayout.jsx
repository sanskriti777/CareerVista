import Sidebar from "../components/dashboard/Sidebar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "30px" }}>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;