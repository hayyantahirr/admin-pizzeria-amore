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
