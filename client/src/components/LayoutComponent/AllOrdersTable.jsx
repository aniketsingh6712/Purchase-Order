import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import StatusLegend from "./status";
import Navbar from "../NavBar/navBar";
import axios from "axios";

const AllOrdersTable = () => {
  const [data, setData] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const recordsPerPage = 10;
  const API_URL = "http://localhost:3001/api/purchase/";

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("authToken");
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) setData(res.data);
        else {
          console.warn("Unexpected API response:", res.data);
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching purchase orders:", err);
        setError("Failed to load purchase orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseOrders();
  }, []);

  // Sort by date
  const sortedRecords = [...data].sort((a, b) =>
    ascending
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filter by status and search
  const filteredRecords = sortedRecords.filter((order) => {
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.createdBy?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 font-semibold";
      case "REJECTED":
        return "text-red-600 font-semibold";
      case "SUBMITTED":
        return "text-blue-600 font-semibold";
      case "DRAFT":
        return "text-gray-500 font-semibold";
      default:
        return "text-black";
    }
  };

  return (
    <>
      <Navbar menuItems={["Home", "Orders"]} />
      <div className="relative mt-6 p-4 m-2 border rounded-md shadow-sm bg-white">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAscending(!ascending)}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Sort by Date {ascending ? "▼" : "▲"}
            </button>

            {/* Dropdown  */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All POs</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by title ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

       
        {/* table */}
        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading purchase orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : currentRecords.length === 0 ? (
          <p className="text-center text-blue-500 mt-4">No purchase orders found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full border-collapse text-blue-600">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Created By</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((order) => (
                    <tr
                      key={order._id || order.id}
                      className="border-b border-blue-600 hover:bg-gray-50 transition text-black"
                    >
                      <td className="py-2 px-4">{order.title}</td>
                      <td className="py-2 px-4">{order.description || "-"}</td>
                      <td className="py-2 px-4">₹{order.amount}</td>
                      <td className="py-2 px-4">
                        {order.createdBy?.name || order.createdBy || "Unknown"}
                      </td>
                      <td className={`py-2 px-4 ${getStatusClass(order.status)}`}>
                        {order.status}
                      </td>
                      <td className="py-2 px-4">
                        <FaInfoCircle
                          className="text-blue-600 text-lg cursor-pointer hover:text-blue-800"
                          onClick={() => setSelectedOrder(order)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                Prev
              </button>
              <span className="text-sm text-blue-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-[450px] max-h-[80vh] overflow-y-auto relative">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Order Details</h2>
              <p><strong>Title:</strong> {selectedOrder.title}</p>
              <p><strong>Description:</strong> {selectedOrder.description || "-"}</p>
              <p><strong>Amount:</strong> ₹{selectedOrder.amount}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Created By:</strong> {selectedOrder.createdBy?.name || selectedOrder.createdBy || "Unknown"}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

              <h3 className="text-lg font-semibold text-blue-600 mt-4 mb-2">History</h3>
              {selectedOrder.history?.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.history.map((h, idx) => (
                    <div key={idx} className="border-l-4 border-blue-600 pl-3 py-2 bg-gray-50 rounded">
                      <p className="text-sm font-semibold text-gray-800">{h.action}</p>
                      <p className="text-xs text-gray-500">
                        By: {h.by?.name || h.by} • {new Date(h.timestamp).toLocaleString()}
                      </p>
                      {h.comment && (
                        <p className="text-xs text-gray-600 mt-1">Comment: {h.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No history available.</p>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllOrdersTable;
