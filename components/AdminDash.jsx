"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import AdminOrderList from "./AdminOrderList";
import AdminMenuItems from "./AdminMenuItems";
import { supabase } from "@/lib/supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Main component for the admin dashboard
const AdminDash = () => {
  // Use the theme context to get the current theme
  const { theme } = useTheme();
  // State to control the visibility of the sidebar
  const [showSidebar, setShowSidebar] = useState(true);
  // State to track the active component to be displayed
  const [activeComponent, setActiveComponent] = useState("dashboard");
  // States for chart data
  const [categoryData, setCategoryData] = useState({});
  const [orderStatusData, setOrderStatusData] = useState({});
  const [loading, setLoading] = useState(true);

  // Set the data-theme attribute on the root element when the theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch data for charts
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch dishes data for pie chart
        const { data: dishesData, error: dishesError } = await supabase
          .from("dishes")
          .select("item_category");
        
        if (dishesError) {
          console.error("Error fetching dishes:", dishesError);
        } else {
          // Count products by category
          const categoryCount = dishesData.reduce((acc, dish) => {
            acc[dish.item_category] = (acc[dish.item_category] || 0) + 1;
            return acc;
          }, {});
          setCategoryData(categoryCount);
        }

        // Fetch order status data for bar chart
        const { data: ordersData, error: ordersError } = await supabase
          .from("order_list")
          .select("order_status");
        
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          // Count orders by status
          const statusCount = ordersData.reduce((acc, order) => {
            const status = order.order_status || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          setOrderStatusData(statusCount);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeComponent === "dashboard") {
      fetchChartData();
    }
  }, [activeComponent]);

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Pie chart configuration
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Products by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderColor: theme === 'light' ? '#ffffff' : '#374151',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'light' ? '#374151' : '#D1D5DB',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Product Distribution by Category',
        color: theme === 'light' ? '#374151' : '#D1D5DB',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  // Bar chart configuration
  const barChartData = {
    labels: ['Completed', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Number of Orders',
        data: [
          orderStatusData['Completed'] || 0,
          orderStatusData['pending'] || 0,
          orderStatusData['Rejected'] || 0
        ],
        backgroundColor: [
          '#10B981', // Green for completed
          '#F59E0B', // Yellow for pending
          '#EF4444'  // Red for rejected
        ],
        borderColor: [
          '#059669',
          '#D97706',
          '#DC2626'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        color: theme === 'light' ? '#374151' : '#D1D5DB',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'light' ? '#6B7280' : '#9CA3AF',
          stepSize: 1
        },
        grid: {
          color: theme === 'light' ? '#E5E7EB' : '#374151'
        }
      },
      x: {
        ticks: {
          color: theme === 'light' ? '#6B7280' : '#9CA3AF'
        },
        grid: {
          color: theme === 'light' ? '#E5E7EB' : '#374151'
        }
      }
    },
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
          <div className={`p-6 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Dashboard Analytics
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                  <div className="h-80">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                  
                  {/* Category Legend */}
                  <div className="mt-4">
                    <h4 className={`text-sm font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Category Legend:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(categoryData).map(([category, count], index) => (
                        <div key={category} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ 
                              backgroundColor: pieChartData.datasets[0].backgroundColor[index % pieChartData.datasets[0].backgroundColor.length] 
                            }}
                          ></div>
                          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                            {category}: {count} items
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                  <div className="h-80">
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                  
                  {/* Status Legend */}
                  <div className="mt-4">
                    <h4 className={`text-sm font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Status Legend:
                    </h4>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Completed: {orderStatusData['Completed'] || 0} orders
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Pending: {orderStatusData['pending'] || 0} orders
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Rejected: {orderStatusData['Rejected'] || 0} orders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`flex h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}
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
