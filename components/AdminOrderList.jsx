"use client";
import { supabase } from "@/lib/supabaseClient";

import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "../Components/ThemeContext";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isUpdating, setIsUpdating] = useState({});
  // const supabase = createClientComponentClient();
  const { theme } = useTheme();

  const statusOptions = [
    "pending",
    "Processing",
    "Completed",
    "Rejected",
    "On Hold",
    "In Transit",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("order_list").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        const groupedOrders = data.reduce((acc, order) => {
          acc[order.order_id] = acc[order.order_id] || [];
          acc[order.order_id].push(order);
          return acc;
        }, {});
        setOrders(groupedOrders);

        // Initialize selected status for each order
        const initialStatus = {};
        Object.keys(groupedOrders).forEach((orderId) => {
          initialStatus[orderId] = groupedOrders[orderId][0].status;
        });
        setSelectedStatus(initialStatus);
      }
    };
    fetchOrders();
  }, [supabase]);

  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const updateOrderStatus = async (orderId) => {
    setIsUpdating((prev) => ({ ...prev, [orderId]: true }));

    try {
      const { error } = await supabase
        .from("order_list")
        .update({ order_status: selectedStatus[orderId] })
        .eq("order_id", orderId)
        .select();

      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
        console.log(orderId, selectedStatus[orderId]);
      } else {
        // Update local state
        setOrders((prev) => {
          const updated = { ...prev };
          updated[orderId] = updated[orderId].map((item) => ({
            ...item,
            status: selectedStatus[orderId],
          }));
          return updated;
        });
        alert("Status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        );
      case "Processing":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            Processing
          </span>
        );
      case "pending":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            Rejected
          </span>
        );
      case "On Hold":
        return (
          <span className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            On Hold
          </span>
        );
      case "In Transit":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            In Transit
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-4 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        Order List
      </h2>
      <div className="overflow-x-auto">
        <table
          className={`w-full text-sm text-left ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <thead
            className={`text-xs uppercase ${
              theme === "light"
                ? "text-gray-700 bg-gray-50"
                : "text-gray-400 bg-gray-700"
            }`}
          >
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Expand</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(orders).map((orderId) => {
              const orderItems = orders[orderId];
              const firstItem = orderItems[0];
              return (
                <>
                  <tr
                    key={orderId}
                    className={`border-b ${
                      theme === "light"
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {orderId}
                    </td>
                    <td className="px-6 py-4">{firstItem.customer_name}</td>
                    <td className="px-6 py-4">{firstItem.delivery_city}</td>
                    <td className="px-6 py-4">
                      {new Date(firstItem.created_at).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true, // makes it AM/PM style
                        }
                      )}
                    </td>
                    <td className="px-6 py-4">{firstItem.order_status}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleOrder(orderId)}
                        className={`${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {expandedOrder === orderId ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === orderId && (
                    <tr
                      className={`${
                        theme === "light" ? "bg-gray-50" : "bg-gray-700"
                      }`}
                    >
                      <td colSpan="6" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3
                              className={`text-lg font-semibold mb-2 ${
                                theme === "light"
                                  ? "text-gray-800"
                                  : "text-white"
                              }`}
                            >
                              Customer Details
                            </h3>
                            <p>
                              <strong>Name:</strong> {firstItem.customer_name}
                            </p>
                            <p>
                              <strong>Email:</strong> {firstItem.customer_email}
                            </p>
                            <p>
                              <strong>phone:</strong> {firstItem.customer_phone}
                            </p>
                            <p>
                              <strong>Address:</strong>
                              {firstItem.delivery_address}
                            </p>
                            <p>
                              <strong>City:</strong> {firstItem.delivery_city}
                            </p>
                            <p>
                              <strong>Payment Method : </strong>
                              {firstItem.payment_method}
                            </p>
                            <p>
                              <strong>Order Price:</strong> Rs.
                              {firstItem.order_total}
                            </p>
                            <p>
                              <strong>Order Time:</strong>
                              {new Date(
                                firstItem.created_at
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true, // makes it AM/PM style
                              })}
                              and
                              {new Date(
                                firstItem.created_at
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short", // "Sept"
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <h3
                              className={`text-lg font-semibold mb-2 ${
                                theme === "light"
                                  ? "text-gray-800"
                                  : "text-white"
                              }`}
                            >
                              Ordered Items
                            </h3>
                            <ul>
                              {orderItems.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex items-center mb-2"
                                >
                                  <img
                                    src={item.item_pic}
                                    alt={item.item_name}
                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                  />
                                  <div>
                                    <p className="font-semibold">
                                      {item.item_name}
                                    </p>
                                    <p className="font-semibold">
                                      category : {item.item_category}
                                    </p>
                                    <p>Quantity: {item.item_quantity}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3
                              className={`text-lg font-semibold mb-2 ${
                                theme === "light"
                                  ? "text-gray-800"
                                  : "text-white"
                              }`}
                            >
                              Update Status
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Current Status:{" "}
                                  {getStatusLabel(firstItem.order_status)}
                                </label>
                                <select
                                  value={
                                    selectedStatus[orderId] ||
                                    firstItem.order_status
                                  }
                                  onChange={(e) =>
                                    handleStatusChange(orderId, e.target.value)
                                  }
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    theme === "light"
                                      ? "bg-white border-gray-300 text-gray-900"
                                      : "bg-gray-600 border-gray-500 text-white"
                                  }`}
                                >
                                  {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() => updateOrderStatus(orderId)}
                                disabled={
                                  isUpdating[orderId] ||
                                  selectedStatus[orderId] ===
                                    firstItem.order_status
                                }
                                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                                  isUpdating[orderId] ||
                                  selectedStatus[orderId] ===
                                    firstItem.order_status
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                {isUpdating[orderId]
                                  ? "Updating..."
                                  : "Update Status"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;
