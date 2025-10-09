import React, { useEffect, useState } from "react";

const ApproverOrRejectedOrderTable = ({ data,view }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  useEffect(()=>{
    setCurrentPage(1)
  },[view])
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedOrders = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full border-collapse text-blue-600">
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
          {paginatedOrders.map((order) => (
            <tr
              key={order._id}
              className="border-b border-blue-600 hover:bg-gray-50 transition text-black"
            >
              <td className="py-2 px-4">{order.title}</td>
              <td className="py-2 px-4">{order.description || "-"}</td>
              <td className="py-2 px-4">₹{order.amount}</td>
              <td className="py-2 px-4">{order.createdBy?.username || "Unknown"}</td>
              <td
                className={`py-2 px-4 font-semibold ${
                  order.status === "APPROVED"
                    ? "text-green-600"
                    : order.status === "REJECTED"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {order.status}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                >
                  View History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
      {data.length > itemsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              History of {selectedOrder.title}
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedOrder.history?.map((h, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-blue-600 pl-3 py-2 bg-gray-50 rounded"
                >
                  <p className="text-sm font-semibold text-gray-800">{h.action}</p>
                  <p className="text-xs text-gray-500">
                    By: {h.by?.username || h.by?._id || "Unknown"} •{" "}
                    {new Date(h.timestamp).toLocaleString()}
                  </p>
                  {h.comment && (
                    <p className="text-xs text-gray-600 mt-1">Comment: {h.comment}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 font-bold right-2 text-gray-500 hover:text-purple-800 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproverOrRejectedOrderTable;
