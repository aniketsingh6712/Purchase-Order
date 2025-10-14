import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register"; 

import UserDashboard from "./Layout/Layout";
import AllOrdersTable from "./components/LayoutComponent/AllOrdersTable";
import ApproverDashboard from "./admin/layout/ApproverDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Protected";
import AdminDashboard from "./components/Admin/admin";
import Navbar from "./components/NavBar/navBar";
function App() {
  return (
    <Router>
       
      <Routes>
        
       

       
        <Route path="/" element={<Login />} />

       
        <Route path="/signup" element={<Register />} />

        {/* <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["CREATOR","APPROVER"]}><UserDashboard /></ProtectedRoute>
          } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={["CREATOR","APPROVER"]}><AllOrdersTable/></ProtectedRoute>
          }/>
        <Route path="/approver" element={
          <ProtectedRoute allowedRoles={["APPROVER"]}><ApproverDashboard/></ProtectedRoute>
          }/>
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashboard/>
         </ProtectedRoute>
        }/> */}
         <Route element={<Navbar  menuItems={["Home", "Orders"]}/>} >

         <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["CREATOR","APPROVER"]}><UserDashboard /></ProtectedRoute>
          } />
         <Route path="/orders" element={
          <ProtectedRoute allowedRoles={["CREATOR","APPROVER"]}><AllOrdersTable/></ProtectedRoute>
          }/>
         </Route>

          <Route element={<Navbar  menuItems={["Home","POs","Orders"]}/>} >
          <Route path="/approver" element={
          <ProtectedRoute allowedRoles={["APPROVER"]}><ApproverDashboard/></ProtectedRoute>
          }/>
           <Route path="/approver/pos" element={
          <ProtectedRoute allowedRoles={["CREATOR","APPROVER"]}><UserDashboard /></ProtectedRoute>
          } />
         <Route path="/approver/orders" element={
          <ProtectedRoute allowedRoles={["CREATOR","APPROVER"]}><AllOrdersTable/></ProtectedRoute>
          }/>
         
          </Route>

       <Route element={<Navbar  menuItems={["Home"]}/>} >
                <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashboard/>
         </ProtectedRoute>
        }/>
          </Route>
      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
