import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/NavBar/navBar";
import SubmittedPurchaseOrderTable from "../Layout component/submittedTable";
import { toast } from "react-toastify";
import ApproverOrRejectedOrderTable from "../Layout component/approverOrRejected";

import { CheckCircle, XCircle } from "lucide-react";
function ApproverDashboard() {
  const [submittedPOs, setSubmittedPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("approved");
  const [approvedPOs,setApprovedPOs]=useState([]);
  const [rejectedPOs,setRejectedPOs]=useState([]);

  const fetchAllPOs = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("authToken");

    try {
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      
      const [processedRes, submittedRes] = await Promise.allSettled([
        axios.get("http://localhost:3001/api/purchase/approver/processed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3001/api/purchase/approver/submitted", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      
      if (processedRes.status === "fulfilled") {
        const processedData = Array.isArray(processedRes.value.data)
          ? processedRes.value.data
          : [];
        const approvedPOs = processedData.filter((po) => po.status === "APPROVED");
        const rejectedPOs = processedData.filter((po) => po.status === "REJECTED");
        setApprovedPOs(approvedPOs);
        setRejectedPOs(rejectedPOs);
      } else {
        console.error("Processed POs fetch failed:", processedRes.reason);
        toast.warn("Couldn't fetch processed POs — showing empty data");
        setApprovedPOs([]);
        setRejectedPOs([]);
      }

      
      if (submittedRes.status === "fulfilled") {
        const submittedData = Array.isArray(submittedRes.value.data)
          ? submittedRes.value.data
          : [];
        setSubmittedPOs(submittedData);
      } else {
        console.error("Submitted POs fetch failed:", submittedRes.reason);
        toast.warn("Couldn't fetch submitted POs — using test data");
        setSubmittedPOs([]); 
      }

    } catch (err) {
      console.error("Critical error while fetching POs:", err);
      if (err.response) {
        
        toast.error(`Server Error: ${err.response.status} - ${err.response.data?.message || "Unknown"}`);
      } else if (err.request) {
        
        toast.error("Network error: Failed to connect to server");
      } else {
        
        toast.error(err.message);
      }

     
      setApprovedPOs([]);
      setRejectedPOs([]);
      setSubmittedPOs([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
  fetchAllPOs();
}, []);

  const approverHandler = async (id, comment) => {
  try {
    setLoading(true);

    const token = sessionStorage.getItem("authToken");

    
    await axios.put(
      `http://localhost:3001/api/purchase/po/${id}/approve`,
      { comment }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Purchase Order approved successfully!");

    

    fetchAllPOs();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Failed to approve PO");
  } finally {
    setLoading(false);
  }
};

const rejectionHandler = async (id, comment) => {
  try {
    setLoading(true);

    const token = sessionStorage.getItem("authToken");

    
  await axios.put(
      `http://localhost:3001/api/purchase/po/${id}/reject`,
      { comment }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.info("Purchase Order rejected");

    fetchAllPOs();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Failed to reject PO");
  } finally {
    setLoading(false);
  }
};

  return (
    <>

      <div className="p-4 sm:p-6 mt-5 max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-green-600">
          Approver Dashboard
        </h2>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          {loading ? (
            <p className="text-center text-blue-600">Loading...</p>
          ) : (
            <SubmittedPurchaseOrderTable data={submittedPOs} approverHandler={approverHandler} rejectionHandler={rejectionHandler}/>
          )}
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

      {/*  Loading */}
      
      {loading ? (
        <p className="text-center text-blue-600">Loading...</p>
      ) : view === "approved" ? (
        approvedPOs.length > 0 ? (
           <ApproverOrRejectedOrderTable data={approvedPOs} view={view}/>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-300 p-3 rounded-md">
            <CheckCircle /> No Approved Purchase Orders
          </div>
        )
      ) : rejectedPOs.length > 0 ? (
         <ApproverOrRejectedOrderTable data={rejectedPOs} view={view}/>
      ) : (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-300 p-3 rounded-md">
          <XCircle /> No Rejected Purchase Orders
        </div>
      )}

    </div>
      </div>
    </>
  );
}

export default ApproverDashboard;

