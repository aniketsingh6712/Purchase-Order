import React, { useEffect, useState } from "react";

import Navbar from "../../components/NavBar/navBar";
import SubmittedPurchaseOrderTable from "../Layout component/submittedTable";
import { toast } from "react-toastify";
import ApproverOrRejectedOrderTable from "../Layout component/approverOrRejected";
// Dummy Data for demo (replace with backend API call)
const dummyPurchaseOrders = [
  {
    _id: "po1",
    title: "Office Chairs",
    description: "Purchase of ergonomic chairs",
    amount: 12000,
    status: "APPROVED",
    createdBy: { _id: "u1", name: "Alice Johnson" },
    approvedBy: { _id: "u2", name: "Manager Bob" },
    history: [
      {
        action: "CREATED",
        by: { _id: "u1", name: "Alice Johnson" },
        comment: "Requested chairs for new office",
        timestamp: new Date("2025-09-20T09:30:00")
      },
      {
        action: "SUBMITTED",
        by: { _id: "u1", name: "Alice Johnson" },
        timestamp: new Date("2025-09-20T10:00:00")
      },
      {
        action: "APPROVED",
        by: { _id: "u2", name: "Manager Bob" },
        comment: "Approved for immediate purchase",
        timestamp: new Date("2025-09-21T14:15:00")
      }
    ]
  },
  {
    _id: "po2",
    title: "Laptop Purchase",
    description: "High-performance laptops for dev team",
    amount: 350000,
    status: "REJECTED",
    createdBy: { _id: "u3", name: "Charlie Brown" },
    approvedBy: null,
    history: [
      {
        action: "CREATED",
        by: { _id: "u3", name: "Charlie Brown" },
        comment: "Requested laptops for development",
        timestamp: new Date("2025-09-18T11:00:00")
      },
      {
        action: "SUBMITTED",
        by: { _id: "u3", name: "Charlie Brown" },
        timestamp: new Date("2025-09-18T12:00:00")
      },
      {
        action: "REJECTED",
        by: { _id: "u2", name: "Manager Bob" },
        comment: "Budget constraints, not approved",
        timestamp: new Date("2025-09-19T15:45:00")
      }
    ]
  },
  {
    _id: "po3",
    title: "Printer Ink",
    description: "Bulk ink cartridges",
    amount: 2500,
    status: "APPROVED",
    createdBy: { _id: "u4", name: "David Smith" },
    approvedBy: { _id: "u2", name: "Manager Bob" },
    history: [
      {
        action: "CREATED",
        by: { _id: "u4", name: "David Smith" },
        timestamp: new Date("2025-09-15T09:00:00")
      },
      {
        action: "APPROVED",
        by: { _id: "u2", name: "Manager Bob" },
        comment: "Small purchase, approved quickly",
        timestamp: new Date("2025-09-15T10:30:00")
      }
    ]
  }
];

const testData = [
  {
    _id: "1",
    title: "Office Chairs",
    description: "Ergonomic chairs for staff",
    amount: 25000,
    status: "Submitted",
    history: [
      {
        action: "Created",
        by: { name: "Alice Johnson" },
        timestamp: new Date("2025-09-20T09:30:00"),
        comment: "Initial request submitted.",
      },
      {
        action: "Reviewed",
        by: { name: "Bob Smith" },
        timestamp: new Date("2025-09-22T11:15:00"),
        comment: "Checked vendor pricing.",
      },
    ],
  },
  {
    _id: "2",
    title: "Laptops",
    description: "Dell XPS 13 for development team",
    amount: 150000,
    status: "Submitted",
    history: [
      {
        action: "Created",
        by: { name: "Carol White" },
        timestamp: new Date("2025-09-25T14:45:00"),
        comment: "Urgent requirement for new hires.",
      },
    ],
  },
  {
    _id: "3",
    title: "Printer Ink",
    description: "HP Toner Cartridges",
    amount: 8000,
    status: "Draft", // won't appear (only "Submitted" shown)
    history: [
      {
        action: "Created",
        by: { name: "David Lee" },
        timestamp: new Date("2025-09-28T10:00:00"),
      },
    ],
  },
  {
    _id: "4",
    title: "Projector",
    description: "Conference room projector replacement",
    amount: 42000,
    status: "Submitted",
    history: [
      {
        action: "Created",
        by: "System Auto",
        timestamp: new Date("2025-09-29T08:20:00"),
      },
      {
        action: "Reviewed",
        by: { name: "Emily Clark" },
        timestamp: new Date("2025-09-30T12:10:00"),
        comment: "Checked compatibility with room setup.",
      },
    ],
  },
];

function ApproverDashboard() {
  const [submittedPOs, setSubmittedPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("approved");
 const approvedPOs = dummyPurchaseOrders.filter((po) => po.status === "APPROVED");
  const rejectedPOs = dummyPurchaseOrders.filter((po) => po.status === "REJECTED");
  // Fetch submitted POs
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        setLoading(true);
        // 🔹 Replace with backend API
        // const { data } = await axios.get("/api/purchase-orders");
        // setSubmittedPOs(data.filter((po) => po.status === "Submitted"));
        setSubmittedPOs(testData); // demo
      } catch (err) {
        toast.error("Failed to fetch submitted purchase orders");
      } finally {
        setLoading(false);
      }
    };

    fetchPOs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 mt-5 max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-green-600">
          Approver Dashboard
        </h2>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          {loading ? (
            <p className="text-center text-blue-600">Loading...</p>
          ) : (
            <SubmittedPurchaseOrderTable data={submittedPOs} />
          )}
        </div>

         {/* Approved & Rejected Purchase Orders */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("approved")}
          className={`px-4 py-2 rounded-md ${
            view === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setView("rejected")}
          className={`px-4 py-2 rounded-md ${
            view === "rejected"
              ? "bg-red-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Error & Loading */}
      {/* {error && (
        <p className="text-center text-red-600 bg-red-100 p-2 rounded">{error}</p>
      )}
      {loading ? (
        <p className="text-center text-blue-600">Loading...</p>
      ) : view === "approved" ? (
        approvedPOs.length > 0 ? (
          <PurchaseOrderTable data={approvedPOs} />
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-300 p-3 rounded-md">
            <CheckCircle /> No Approved Purchase Orders
          </div>
        )
      ) : rejectedPOs.length > 0 ? (
        <PurchaseOrderTable data={rejectedPOs} />
      ) : (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-300 p-3 rounded-md">
          <XCircle /> No Rejected Purchase Orders
        </div>
      )} */}
{view === "approved" ? (
        <ApproverOrRejectedOrderTable data={approvedPOs} />
      ) : (
        <ApproverOrRejectedOrderTable data={rejectedPOs} />
      )}
    </div>
      </div>
    </>
  );
}

export default ApproverDashboard;

