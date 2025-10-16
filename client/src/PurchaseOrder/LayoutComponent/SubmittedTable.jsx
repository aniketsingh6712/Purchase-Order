import React from "react";

import { File} from "lucide-react";

const SubmittedPurchaseOrderTable = ({ data }) => {
  
  const submittedOrders = Array.isArray(data)
    ? data.filter((order) => order.status === "SUBMITTED")
    : [];


  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      

      {submittedOrders.length === 0 ? (
         <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-300 p-3 rounded-md">
                <File /> No Submitted Purchase Order
              </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse text-green-600">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {submittedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-green-600 hover:bg-gray-50 transition text-black"
                >
                  <td className="py-2 px-4">{order.title}</td>
                  <td className="py-2 px-4">{order.description || "-"}</td>
                  <td className="py-2 px-4">₹{order.amount}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">
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

export default SubmittedPurchaseOrderTable;
