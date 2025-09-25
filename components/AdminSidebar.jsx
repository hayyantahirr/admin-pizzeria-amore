"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaHome, FaPizzaSlice, FaClipboardList, FaSignOutAlt, FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const AdminSidebar = ({ showSidebar, setShowSidebar, setActiveComponent, activeComponent }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef(null);

  const handleSignOut = () => {
    // For now, just redirect to home page
    router.push('/');
  };

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      // Only handle clicks outside when sidebar is shown and we're on mobile
      if (
        showSidebar && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && 
        window.innerWidth < 768 &&
        // Make sure we're not clicking the toggle button itself
        !event.target.closest('button[aria-label="Toggle Sidebar"]')
      ) {
        // Use the setShowSidebar prop directly instead of simulating a click
        setShowSidebar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar, setShowSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`w-64 h-screen fixed md:relative transition-all duration-300 z-20 ${
        showSidebar ? "left-0" : "-left-64 md:left-0"
      }`}
      style={{ backgroundColor: 'var(--sidebar-bg)' }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--sidebar-text)' }}>Pizzeria Amore</h2>
          {/* Close button - visible only on mobile */}
          <button 
            className="md:hidden hover:opacity-80"
            onClick={() => setShowSidebar(false)}
            aria-label="Close Sidebar"
            style={{ color: 'var(--sidebar-text)' }}
          >
            <FaTimes size={20} />
          </button>
        </div>

      

        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveComponent('dashboard')}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === 'dashboard' ? '' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                style={{
                  backgroundColor: activeComponent === 'dashboard' ? 'var(--accent)' : 'transparent',
                  color: activeComponent === 'dashboard' ? 'white' : 'var(--sidebar-text)',
                }}
              >
                <FaHome className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent('menu')}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === 'menu' ? '' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                style={{
                  backgroundColor: activeComponent === 'menu' ? 'var(--accent)' : 'transparent',
                  color: activeComponent === 'menu' ? 'white' : 'var(--sidebar-text)',
                }}
              >
                <FaPizzaSlice className="mr-3" />
                <span>Menu Items</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent('orders')}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === 'orders' ? '' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                style={{
                  backgroundColor: activeComponent === 'orders' ? 'var(--accent)' : 'transparent',
                  color: activeComponent === 'orders' ? 'white' : 'var(--sidebar-text)',
                }}
              >
                <FaClipboardList className="mr-3" />
                <span>Order List</span>
              </button>
            </li>
            <li className="mt-auto pt-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-md cursor-pointer"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
