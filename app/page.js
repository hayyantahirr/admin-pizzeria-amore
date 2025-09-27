"use client";

import React from "react";
import AdminDash from "@/Components/AdminDash";

import ThemeToggleButton from "@/Components/ThemeToggleButton.jsx";
import { ThemeProvider } from "@/Components/ThemeContext";

// Admin dashboard page component
const Admin = () => {
  return (
    // Wrap the admin dashboard with ThemeProvider to enable theme switching
    <ThemeProvider>
      {/* Main admin dashboard component */}
      <AdminDash />
      {/* Theme toggle button for switching between light and dark modes */}
      <ThemeToggleButton />
    </ThemeProvider>
  );
};

export default Admin;
