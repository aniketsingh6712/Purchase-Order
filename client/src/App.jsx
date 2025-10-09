import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register"; 

import UserDashboard from "./Layout/Layout";
import AllOrdersTable from "./components/LayoutComponent/AllOrdersTable";
import ApproverDashboard from "./admin/layout/ApproverDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Protected";
function App() {
  return (
    <Router>
       
      <Routes>
        
       

       
        <Route path="/" element={<Login />} />

       
        <Route path="/signup" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["CREATOR"]}><UserDashboard /></ProtectedRoute>
          } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={["CREATOR"]}><AllOrdersTable/></ProtectedRoute>
          }/>
        <Route path="/approver" element={
          <ProtectedRoute allowedRoles={["APPROVER"]}><ApproverDashboard/></ProtectedRoute>
          }/>

      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
