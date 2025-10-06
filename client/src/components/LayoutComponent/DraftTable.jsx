import React from "react";
const dummyData = [
    {
      id: 1,
      title: "Office Supplies",
      description: "Notebooks, pens, and staplers",
      amount: 1200,
      status: "Draft",
    },
    {
      id: 2,
      title: "Laptop Purchase",
      description: "Dell Inspiron for new hire",
      amount: 55000,
      status: "Draft",
    },
    {
      id: 3,
      title: "Furniture",
      description: "Office chairs and desks",
      amount: 20000,
      status: "Draft",
    },
    {
      id: 4,
      title: "Snacks for Pantry",
      description: "",
      amount: 1500,
      status: "Rejected",
    },
  ];
const DraftPurchaseOrderTable = ({ data,onDraftSubmit }) => {
  // Filter only draft orders
  const draftOrders = Array.isArray(dummyData)
    ? dummyData.filter((order) => order.status === "Draft")
    : [];

  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">
        Draft Purchase Orders
      </h2>

      {draftOrders.length === 0 ? (
        <p className="text-center text-gray-500">No draft purchase orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse text-blue-600">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Amount</th>
               
                <th className="py-2 px-4">Status</th>
                 <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {draftOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-blue-600 hover:bg-gray-50 transition text-black"
                >
                  <td className="py-2 px-4">{order.title}</td>
                  <td className="py-2 px-4">{order.description || "-"}</td>
                  <td className="py-2 px-4">₹{order.amount}</td>
                 
                  <td className="py-2 px-4 text-yellow-600 font-semibold">
                    {order.status}
                  </td>
                   <td className="py-2 px-4">
                    <button
                      onClick={() => onDraftSubmit(order.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Submit Order
                    </button>
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

export default DraftPurchaseOrderTable;