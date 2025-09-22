"use client";

import React from 'react';
import { useTheme } from './ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

// Button component to toggle between light and dark themes
const ThemeToggleButton = () => {
  // Use the theme context to get the current theme and the toggle function
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme} // Toggle the theme when the button is clicked
      className="fixed bottom-4 right-4 bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition-transform transform hover:scale-110"
      aria-label="Toggle theme"
    >
      {/* Conditionally render the moon or sun icon based on the current theme */}
      {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  );
};

export default ThemeToggleButton;