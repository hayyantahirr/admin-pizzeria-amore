"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import AdminOrderList from "./AdminOrderList";
import AdminMenuItems from "./AdminMenuItems";

// Main component for the admin dashboard
const AdminDash = () => {
  // Use the theme context to get the current theme
  const { theme } = useTheme();
  // State to control the visibility of the sidebar
  const [showSidebar, setShowSidebar] = useState(true);
  // State to track the active component to be displayed
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Set the data-theme attribute on the root element when the theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Function to render the component based on the activeComponent state
  const renderComponent = () => {
    switch (activeComponent) {
      case "orders":
        return <AdminOrderList />;
      case "menu":
        return <AdminMenuItems />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div
              className="rounded-lg shadow p-4"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <p>Welcome to the admin dashboard.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Render the sidebar component */}
      <AdminSidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Render the navigation bar component */}
        <AdminNav toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {/* Render the active component */}
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDash;
