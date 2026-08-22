import { useState, Children, isValidElement, cloneElement } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import "./MainLayout.css";

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Automatically attach onToggleSidebar to Topbar if rendered as direct child
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child) && (child.type.name === "Topbar" || child.type.name === "TopBar")) {
      return cloneElement(child, { onToggleSidebar: toggleSidebar });
    }
    return child;
  });

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="layout-main">
        {childrenWithProps}
      </main>
    </div>
  );
}

export default MainLayout;