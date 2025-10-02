import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const PurchaseOrderTable = ({ data: initialData }) => {
  const [data, setData] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const recordsPerPage = 10;

  useEffect(() => {
    setData(Array.isArray(initialData) ? initialData : []);
  }, [initialData]);

  const sortedRecords = [...data].sort((a, b) =>
    ascending
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setAscending(!ascending)}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Sort by Date {ascending ? "▼" : "▲"}
        </button>
      </div>

      {/* Table */}
      {currentRecords.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No purchase orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse text-blue-600">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Created By</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-blue-600 hover:bg-gray-50 transition text-black"
                  >
                    <td className="py-2 px-4">{order.title}</td>
                    <td className="py-2 px-4">{order.description || "-"}</td>
                    <td className="py-2 px-4">₹{order.amount}</td>
                    <td className="py-2 px-4">{order.createdBy || "Unknown"}</td>
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

          {/* Pagination */}
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
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer "
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Order Details</h2>
            <p><strong>Title:</strong> {selectedOrder.title}</p>
            <p><strong>Description:</strong> {selectedOrder.description || "-"}</p>
            <p><strong>Amount:</strong> ₹{selectedOrder.amount}</p>
            <p><strong>Created By:</strong> {selectedOrder.createdBy || "Unknown"}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>

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
  );
};

export default PurchaseOrderTable;
