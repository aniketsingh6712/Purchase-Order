import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register"; 
import Navbar from "./components/NavBar/navBar";
import UserDashboard from "./Layout/Layout";
import AllOrdersTable from "./components/LayoutComponent/AllOrdersTable";
import ApproverDashboard from "./admin/layout/ApproverDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <Router>
        <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        
       

       
        <Route path="/login" element={<Login />} />

       
        <Route path="/signup" element={<Register />} />

        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/orders" element={<AllOrdersTable/>}/>
        <Route path="/approver" element={<ApproverDashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
