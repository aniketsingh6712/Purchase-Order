

import React, { useEffect, useState } from "react";
import { Plus, FileX2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import EmptyDataPrompt from "../components/EmptyDataPrompt";
import DraftPurchaseOrderTable from "../components/LayoutComponent/DraftTable";
import SubmittedPurchaseOrderTable from "../components/LayoutComponent/SubmittedTable";
import ExpenseForm from "../components/LayoutComponent/form"; // <-- use the schema-matching form
import PurchaseOrderTable from "../components/LayoutComponent/PurchaseorderTable";
import { toast } from "react-toastify";
import usePurchaseOrders from "./usePurchaseOrder";
import Navbar from "../components/NavBar/navBar";


// dummyData.js
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

function UserDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [poToDelete, setPoToDelete] = useState(null);

  const [draftPOs, setDraftPOs] = useState([]);
 
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("approved"); // toggle Approved / Rejected
// const { approvedPOs, rejectedPOs, loadingPos, error, refresh } = usePurchaseOrders();
 const approvedPOs = dummyPurchaseOrders.filter((po) => po.status === "APPROVED");
  const rejectedPOs = dummyPurchaseOrders.filter((po) => po.status === "REJECTED");
  // Fetch POs
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/purchase-orders"); // adjust backend route
        setDraftPOs(data.filter((po) => po.status === "Draft"));
        setApprovedPOs(data.filter((po) => po.status === "Approved"));
        setRejectedPOs(data.filter((po) => po.status === "Rejected"));
      } catch (err) {
        toast.error("Failed to fetch purchase orders");
      } finally {
        setLoading(false);
      }
    };

    fetchPOs();
  }, []);

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/purchase-orders", { ...formData, status: "Draft" });
      toast.success("Purchase Order Drafted");
      setShowForm(false);
    } catch (err) {
      toast.error("Failed to create purchase order");
    }
  };

   const submitPurchaseOrder = async (id) => {
    // try {
    //   await axios.delete(`http://localhost:8080/api/activities/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //     data: { date: today },
    //   });
    //   toast.success("Purchase order submitted successfully!");
    //   fetchTodayActivities(); // Refresh after submit
    // } catch (err) {
    //   console.error("Error submitting purchase order", err);
    //   toast.error("Failed to submit purchase order");
    // }
    console.log(id);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/purchase-orders/${poToDelete}`);
      toast.success("Purchase Order Deleted");
      setShowConfirm(false);
      setPoToDelete(null);
    } catch (err) {
      toast.error("Failed to delete purchase order");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="p-4 sm:p-6 mt-5 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">Purchase Order Dashboard</h2>

      {/* Drafted Purchase Orders */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-600">Drafted Purchase Orders</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={20} /> Draft New PO
          </button>
        </div>

        {loading ? (
          <p className="text-center text-blue-600">Loading...</p>
        ) : draftPOs.length === 0 ? (
          // <EmptyDataPrompt message="No drafted purchase orders found" />
          <DraftPurchaseOrderTable onDelete={(id)=>{
              submitPurchaseOrder(id);
          }}/>
        ) : (
          <PurchaseOrderTable
            
          />
        )}
      </div>


      <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold text-green-600">
      Submitted Purchase Orders
    </h2>
  </div>

  <SubmittedPurchaseOrderTable/>
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
        <PurchaseOrderTable data={approvedPOs} />
      ) : (
        <PurchaseOrderTable data={rejectedPOs} />
      )}
    

      
    </div>
      {/* Form Modal */}
      {(showForm || editData) && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex justify-center items-center z-50 p-2">
          <form
            onSubmit={showForm ? handleSubmit : handleUpdate}
            className="bg-white p-4 sm:p-6 rounded-lg shadow max-w-md w-full space-y-4"
          >
            <ExpenseForm formData={formData} onChange={handleChange} />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => (showForm ? setShowForm(false) : setEditData(null))}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                {showForm ? "Submit" : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      
    </div>
    </>
  );
}

export default UserDashboard;
