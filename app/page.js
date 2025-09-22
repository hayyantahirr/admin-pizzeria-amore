"use client";

import React from "react";
import AdminDash from "@/Components/AdminDash";
import { ThemeProvider } from "@/Components/ThemeContext";
import ThemeToggleButton from "@/Components/ThemeToggleButton";

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
