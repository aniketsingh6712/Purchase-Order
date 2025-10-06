import React, { useEffect, useState, useCallback } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import EmptyDataPrompt from "../components/EmptyDataPrompt";
import DraftPurchaseOrderTable from "../components/LayoutComponent/DraftTable";
import SubmittedPurchaseOrderTable from "../components/LayoutComponent/SubmittedTable";
import ExpenseForm from "../components/LayoutComponent/form";
import PurchaseOrderTable from "../components/LayoutComponent/PurchaseorderTable";
import { toast } from "react-toastify";
import Navbar from "../components/NavBar/navBar";
import { dummyPurchaseOrders } from "../components/LayoutComponent/ApproverOrRejectedDummyData";
function UserDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("approved"); // toggle Approved / Rejected

  const [draftPOs, setDraftPOs] = useState([]);
  const [submittedPOs, setSubmittedPOs] = useState([]);
  const [approvedPOs, setApprovedPOs] = useState([]);
  const [rejectedPOs, setRejectedPOs] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("authToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fetch all PO data with per-request error handling
  const fetchPOs = useCallback(async () => {
    try {
      setLoading(true);

      const [draftRes, submittedRes, completedRes] = await Promise.allSettled([
        axios.get("/api/purchase/my?status=DRAFT", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/purchase/my?status=SUBMITTED", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/purchase/my/completed", {
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
        setApprovedPOs(dummyPurchaseOrders.filter((po) => po.status === "APPROVED"));
        setRejectedPOs(dummyPurchaseOrders.filter((po) => po.status === "REJECTED"));
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

  // 🧾 Submit new Purchase Order
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

  const DraftSubmit=async (id)=>{
    try{
      await axios.put(`"http://localhost:3001/api/purchase/po/${id}/submit`,{
        headers:{Authorization:`Bearer ${token}`},
      });
       toast.success("Purchase order submitted successfully!");
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 mt-5 max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-blue-600">
          Purchase Order Dashboard
        </h2>

        {/* Drafted Purchase Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-600">
              Drafted Purchase Orders
            </h2>
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
            <DraftPurchaseOrderTable data={draftPOs} />
          )}
        </div>

        {/* Submitted Purchase Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold text-green-600">
            Submitted Purchase Orders
          </h2>
          <SubmittedPurchaseOrderTable data={submittedPOs} />
        </div>

        {/* Approved & Rejected Purchase Orders */}
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
          )}
        </div>

        {/* Form Modal for New PO */}
        {showForm && (
          <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex justify-center items-center z-50 p-2">
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
    </>
  );
}

export default UserDashboard;
