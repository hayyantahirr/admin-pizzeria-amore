import React from "react";

const AdminOrderList = () => {
  return (
    <div className="p-6">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--foreground)" }}
      >
        Order List
      </h2>
      <div
        className="rounded-lg shadow p-4"
        style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
      >
        <p>Order list content will be displayed here.</p>
      </div>
    </div>
  );
};

export default AdminOrderList;
