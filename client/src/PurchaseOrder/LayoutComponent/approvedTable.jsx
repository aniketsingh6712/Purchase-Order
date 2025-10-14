import React, { useState, useEffect } from "react";

const StatusPurchaseOrderTable = ({ data }) => {
  const [status, setStatus] = useState("Approved"); 
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (!Array.isArray(data)) return;
    setFilteredOrders(data.filter((order) => order.status === status));
  }, [status, data]);

  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-700">
          {status} Purchase Orders
        </h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md p-2 text-sm"
        >
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">
          No {status.toLowerCase()} purchase orders found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse text-blue-600">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Created By</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-blue-600 hover:bg-gray-50 transition text-black"
                >
                  <td className="py-2 px-4">{order.title}</td>
                  <td className="py-2 px-4">{order.description || "-"}</td>
                  <td className="py-2 px-4">₹{order.amount}</td>
                  <td className="py-2 px-4">{order.createdBy || "Unknown"}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      order.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatusPurchaseOrderTable;
