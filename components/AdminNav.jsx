"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

const AdminNav = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({
    name: "Admin",
    image: "/user.jpg",
  });

  useEffect(() => {
    // Fetch the current user data from Supabase
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Get user profile data from profiles table
          const { data } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();

          setUser({
            name:
              data?.full_name ||
              user.user_metadata?.full_name ||
              user.email ||
              "Admin",
            image:
              data?.avatar_url || user.user_metadata?.avatar_url || "/user.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  

  return (
    <nav
      className="shadow-sm p-4"
      style={{ backgroundColor: "var(--nav-bg)", color: "var(--nav-text)" }}
    >
      <div className="flex items-center justify-between">
        {/* Logo and Menu Icon */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="hover:opacity-75 focus:outline-none"
            aria-label="Toggle Sidebar"
            style={{ color: "var(--nav-text)" }}
          >
            <FaBars size={20} />
          </button>
          <div className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Pizzeria Amore Logo"
              width={40}
              height={40}
              className="mr-2 rounded-full"
            />
            <span
              className="text-xl font-bold hidden sm:inline"
              style={{ color: "var(--nav-text)" }}
            >
              Pizzeria Amore
            </span>
          </div>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block flex-1 mx-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-md pl-10 pr-4 py-2 rounded-lg border focus:outline-none"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--nav-text)",
                "--ring-color": "var(--accent)",
              }}
              onFocus={(e) =>
                (e.target.style.boxShadow = `0 0 0 2px var(--ring-color)`)
              }
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
            <FaSearch
              className="absolute left-3 top-3"
              style={{ color: "var(--nav-text)" }}
            />
          </div>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center space-x-4">
          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={user.image}
                  alt="Admin Profile"
                  width={32}
                  height={32}
                />
              </div>
              <span
                className="hidden md:inline text-sm font-medium"
                style={{ color: "var(--nav-text)" }}
              >
                {user.name}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
