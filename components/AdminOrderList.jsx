"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";

import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "./ThemeContext";


const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isUpdating, setIsUpdating] = useState({});
  // const supabase = createClientComponentClient();
  const { theme } = useTheme();

  const statusOptions = ["pending", "Completed", "Rejected"];

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

  const deleteOrder = async (orderId) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete all products for Order ID: ${orderId}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setIsUpdating((prev) => ({ ...prev, [orderId]: true }));

    try {
      const { error } = await supabase
        .from("order_list")
        .delete()
        .eq("order_id", orderId);

      if (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order. Please try again.");
      } else {
        // Remove from local state
        setOrders((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });

        // Remove from selectedStatus
        setSelectedStatus((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });

        // Close expanded view if this order was expanded
        if (expandedOrder === orderId) {
          setExpandedOrder(null);
        }

        alert("Order deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
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
      className={`rounded-lg shadow-md p-3 sm:p-6 m-2 sm:m-5 ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}
    >
      <h2
        className={`text-xl sm:text-2xl font-semibold mb-4 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        Order List
      </h2>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {Object.keys(orders).map((orderId) => {
          const orderItems = orders[orderId];
          const firstItem = orderItems[0];
          return (
            <div
              key={orderId}
              className={`mb-4 rounded-lg border ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-gray-700 border-gray-600"
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Order #
                      {orderId.length > 8
                        ? orderId.slice(0, 8) + "..."
                        : orderId}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      }`}
                    >
                      {firstItem.customer_name}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleOrder(orderId)}
                    className={`p-2 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {expandedOrder === orderId ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span
                    className={
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }
                  >
                    {firstItem.delivery_city}
                  </span>
                  <span
                    className={
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }
                  >
                    {new Date(firstItem.created_at).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </span>
                </div>

                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      firstItem.order_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : firstItem.order_status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : firstItem.order_status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {firstItem.order_status}
                  </span>
                </div>
              </div>

              {expandedOrder === orderId && (
                <div
                  className={`border-t p-4 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-gray-600 border-gray-500"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Customer Details */}
                    <div>
                      <h4
                        className={`font-semibold mb-2 text-sm ${
                          theme === "light" ? "text-gray-800" : "text-white"
                        }`}
                      >
                        Customer Details
                      </h4>
                      <div className="text-xs space-y-1">
                        <p>
                          <strong>Order ID:</strong> {orderId}
                        </p>
                        <p>
                          <strong>Name:</strong> {firstItem.customer_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {firstItem.customer_email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {firstItem.customer_phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {firstItem.delivery_address}
                        </p>
                        <p>
                          <strong>City:</strong> {firstItem.delivery_city}
                        </p>
                        <p>
                          <strong>Payment:</strong> {firstItem.payment_method}
                        </p>
                        <p>
                          <strong>Total:</strong> Rs. {firstItem.order_total}
                        </p>
                        {firstItem.delivery_notes && (
                          <p>
                            <strong>Notes:</strong> {firstItem.delivery_notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div>
                      <h4
                        className={`font-semibold mb-2 text-sm ${
                          theme === "light" ? "text-gray-800" : "text-white"
                        }`}
                      >
                        Ordered Items
                      </h4>
                      <div className="space-y-2">
                        {orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={item.item_pic}
                              alt={item.item_name}
                              className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {item.item_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.item_quantity}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.item_category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4
                        className={`font-semibold mb-2 text-sm ${
                          theme === "light" ? "text-gray-800" : "text-white"
                        }`}
                      >
                        Update Status
                      </h4>
                      <div className="space-y-2">
                        <select
                          value={
                            selectedStatus[orderId] || firstItem.order_status
                          }
                          onChange={(e) =>
                            handleStatusChange(orderId, e.target.value)
                          }
                          className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateOrderStatus(orderId)}
                            disabled={
                              isUpdating[orderId] ||
                              selectedStatus[orderId] === firstItem.order_status
                            }
                            className={`flex-1 px-3 py-1 text-xs rounded font-medium transition-colors ${
                              isUpdating[orderId] ||
                              selectedStatus[orderId] === firstItem.order_status
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isUpdating[orderId] ? "Updating..." : "Update"}
                          </button>
                          <button
                            onClick={() => deleteOrder(orderId)}
                            disabled={isUpdating[orderId]}
                            className={`flex-1 px-3 py-1 text-xs rounded font-medium transition-colors ${
                              isUpdating[orderId]
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            {isUpdating[orderId] ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                Order Time
              </th>
              <th scope="col" className="px-6 py-3">
                Order Status
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
                <React.Fragment key={orderId}>
                  <tr
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
                      {orderId.length > 7
                        ? orderId.slice(0, 7) + "..."
                        : orderId}
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
                              <strong>Order-Id : </strong> {orderId}
                            </p>
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
                              <strong>Delivery Notes :</strong>{" "}
                              {firstItem.delivery_notes}
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
                              &
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
                              {/* Delete button  */}
                              <button
                                onClick={() => deleteOrder(orderId)}
                                disabled={isUpdating[orderId]}
                                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                                  isUpdating[orderId]
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                              >
                                {isUpdating[orderId]
                                  ? "Deleting..."
                                  : "Delete Order"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;
