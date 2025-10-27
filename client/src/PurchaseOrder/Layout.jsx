import React, { useEffect, useState, useCallback } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import EmptyDataPrompt from "../EmptyData/EmptyDataPrompt";
import DraftPurchaseOrderTable from "./LayoutComponent/DraftTable";
import SubmittedPurchaseOrderTable from "./LayoutComponent/SubmittedTable";
import ExpenseForm from "./LayoutComponent/form";
import PurchaseOrderTable from "./LayoutComponent/PurchaseorderTable";
import { toast } from "react-toastify";




function UserDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("approved"); 
    const [mainView, setMainView] = useState("draft"); 

  const [draftPOs, setDraftPOs] = useState([]);
  const [submittedPOs, setSubmittedPOs] = useState([]);
  const [approvedPOs, setApprovedPOs] = useState([]);
  const [rejectedPOs, setRejectedPOs] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const token = sessionStorage.getItem("authToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const fetchPOs = useCallback(async () => {
    try {
      setLoading(true);

      const [draftRes, submittedRes, completedRes] = await Promise.allSettled([
        
        axios.get("http://localhost:3001/api/purchase/my?status=DRAFT", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3001/api/purchase/my?status=SUBMITTED", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3001/api/purchase/my/completed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
     
      

      if (draftRes.status === "fulfilled") {
        setDraftPOs(draftRes.value.data);
      } else {
        console.error("Error fetching draft POs:", draftRes.reason);
        toast.error("Failed to fetch draft POs");
        setDraftPOs([]);
      }

      if (submittedRes.status === "fulfilled") {
        setSubmittedPOs(submittedRes.value.data);
      } else {
        console.error("Error fetching submitted POs:", submittedRes.reason);
        toast.error("Failed to fetch submitted POs");
        setSubmittedPOs([]);
      }

      if (completedRes.status === "fulfilled") {
        const completedData = completedRes.value.data;
        setApprovedPOs(completedData.filter((po) => po.status === "APPROVED"));
        setRejectedPOs(completedData.filter((po) => po.status === "REJECTED"));
      } else {
        console.error("Error fetching completed POs:", completedRes.reason);
        toast.error("Failed to fetch completed POs");
        setApprovedPOs([]);
        setRejectedPOs([]);
      }
    } catch (err) {
      console.error("Unexpected error in fetchPOs:", err);
      toast.error("Something went wrong while fetching purchase orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  
  useEffect(() => {
 
    fetchPOs();
    
  }, [fetchPOs]);

  //Submit new Purchase Order
  const submitPurchaseOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/purchase/po", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Purchase order drafted successfully!");
      setShowForm(false);
      setFormData({ title: "", description: "", amount: "" });
      await fetchPOs();
    } catch (err) {
      console.error("Error submitting purchase order", err);
      toast.error("Failed to submit purchase order");
    }
  };

  //draft 
  const DraftSubmit = async (id) => {
     if (!window.confirm("Are you sure you want to submit this Purchase Order?")) return;
  try {
    await axios.put(
      `http://localhost:3001/api/purchase/po/${id}/submit`,
      {}, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Purchase order submitted successfully!");
    fetchPOs();
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("Failed to submit purchase order.");
  }
};

//delete
const DeletePOs = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Purchase Order?")) return;

    try {
      

      await axios.delete(`http://localhost:3001/api/purchase/po/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

     
      setDraftPOs((prev) => prev.filter((po) => po._id !== id));

      toast.success("Purchase Order deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete PO");
    }
  };
 return (
  <div className="flex min-h-screen">
    
    {/* Sidebar */}
    <div className="w-56 bg-[#155dfc] text-white p-4 flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-4">POs  Dashboard</h2>
      <button
        onClick={() => setMainView("draft")}
        className={`p-3 rounded-lg text-left transition ${
          mainView=== "draft" ? "bg-white text-[#155dfc]" : "hover:bg-blue-700"
        }`}
      >
        Drafted POs
      </button>

      <button
        onClick={() => setMainView("submitted")}
        className={`p-3 rounded-lg text-left transition ${
          mainView === "submitted" ? "bg-white text-[#155dfc]" : "hover:bg-blue-700"
        }`}
      >
        Submitted POs
      </button>

      <button
        onClick={() => setMainView("completed")}
        className={`p-3 rounded-lg text-left transition ${
          mainView === "completed" ? "bg-white text-[#155dfc]" : "hover:bg-blue-700"
        }`}
      >
        Approved / Rejected
      </button>

      <button
        onClick={() => setMainView("create")}
        className={`p-3 rounded-lg text-left transition ${
          mainView === "create" ? "bg-white text-[#155dfc]" : "hover:bg-blue-700"
        }`}
      >
        Create New PO
      </button>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-6 space-y-6 bg-white-700">

      {/** -------- Drafted -------- */}
      {mainView === "draft" && (
        <>
        <h2 className="text-xl font-semibold text-blue-600">
              Drafted Purchase Orders
            </h2>
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-center">
            
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
            <EmptyDataPrompt message="No drafted purchase orders found" />
          ) : (
            <DraftPurchaseOrderTable
              data={draftPOs}
              onDraftSubmit={DraftSubmit}
              onDeletePOs={DeletePOs}
            />
          )}
        </div>
        </>
      )}

      {/** -------- Submitted -------- */}
      {mainView === "submitted" && (
        <>
        <h2 className="text-xl font-semibold text-green-600">
            Submitted Purchase Orders
          </h2>
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
         

          {loading ? (
            <p className="text-center text-blue-600">Loading...</p>
          ) : (
            <SubmittedPurchaseOrderTable data={submittedPOs} />
          )}
        </div>
        </>
      )}

      {/** -------- Approved / Rejected -------- */}
      {mainView === "completed" && (
       <div className="bg-white p-4 rounded-lg shadow space-y-4">
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
         {loading ? (
            <p className="text-center text-blue-600">Loading...</p>
          ) : view === "approved" ? (
            approvedPOs.length > 0 ? (
              <PurchaseOrderTable data={approvedPOs} view={view}/>
            ) : (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-300 p-3 rounded-md">
                <CheckCircle /> No Approved Purchase Orders
              </div>
            )
          ) : rejectedPOs.length > 0 ? (
            <PurchaseOrderTable data={rejectedPOs} view={view}/>
          ) : (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-300 p-3 rounded-md">
              <XCircle /> No Rejected Purchase Orders
            </div>
          )}
       
        </div>
      )}

      {/** -------- Create PO View -------- */}
      {mainView === "create" && (
        <div className="flex justify-center items-center ">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow lg:w-lg sm:w-sm" >
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Create New Purchase Order</h2>
          <form onSubmit={submitPurchaseOrder} className="space-y-4 ">
            <ExpenseForm formData={formData} onChange={handleChange} />

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                Save PO
              </button>
            </div>
          </form>
        </div>
        </div>
      )}
    </div>

    {/* Form Modal (kept same for quick draft from draft tab) */}
    {showForm && (
      <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex justify-center items-center z-50 p-2">
        <form
          onSubmit={submitPurchaseOrder}
          className="bg-white p-4 sm:p-6 rounded-lg shadow max-w-md w-full space-y-4"
        >
          <ExpenseForm formData={formData} onChange={handleChange} />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
);

}

export default UserDashboard;
