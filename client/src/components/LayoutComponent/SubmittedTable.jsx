import React from "react";

const dummyData = [
  {
    id: 1,
    title: "Office Supplies",
    description: "Notebooks, pens, and staplers",
    amount: 1200,
    status: "Submitted",
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
    status: "Submitted",
  },
  {
    id: 4,
    title: "Snacks for Pantry",
    description: "",
    amount: 1500,
    status: "Rejected",
  },
];

const SubmittedPurchaseOrderTable = ({ data }) => {
  // Filter only submitted orders
  const submittedOrders = Array.isArray(dummyData)
    ? dummyData.filter((order) => order.status === "Submitted")
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
