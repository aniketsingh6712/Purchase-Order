import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { X } from "lucide-react";

const SubmittedPurchaseOrderTable = ({ data ,approverHandler,rejectionHandler}) => {
  const [selectedOrder, setSelectedOrder] = useState(null); // for history modal
  const [actionOrder, setActionOrder] = useState(null); // for action popup
  const [comment, setComment] = useState("");

  const submittedOrders = Array.isArray(data)
    ? data.filter((order) => order.status === "Submitted")
    : [];

 
  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-green-700 mb-4">
        Submitted Purchase Orders
      </h2>

      {submittedOrders.length === 0 ? (
        <p className="text-center text-gray-500">
          No submitted purchase orders found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse text-green-600">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">History</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {submittedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-green-600 hover:bg-gray-50 transition text-black"
                >
                  <td className="py-2 px-4">{order.title}</td>
                  <td className="py-2 px-4">{order.description || "-"}</td>
                  <td className="py-2 px-4">₹{order.amount}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaInfoCircle size={18} />
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => setActionOrder(order)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Take Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 History Modal */}
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
                  <p className="text-sm font-semibold text-gray-800">
                    {h.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    By: {h.by?.name || h.by} •{" "}
                    {new Date(h.timestamp).toLocaleString()}
                  </p>
                  {h.comment && (
                    <p className="text-xs text-gray-600 mt-1">
                      Comment: {h.comment}
                    </p>
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

    

      {/* 🔹 Action Popup */}
      {actionOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setActionOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              Take Action - {actionOrder.title}
            </h3>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comment "
              rows={3}
              className="w-full border rounded-md p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={()=>rejectionHandler(actionOrder._id,comment)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Reject
              </button>
              <button
                onClick={()=>approverHandler(actionOrder._id,comment)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedPurchaseOrderTable;
