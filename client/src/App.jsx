import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register"; 
import Navbar from "./components/NavBar/navBar";
import UserDashboard from "./Layout/Layout";
import PurchaseOrderTable from "./components/LayoutComponent/table2";
import ApproverDashboard from "./admin/layout/ApproverDashboard";


function App() {
  return (
    <Router>
        
      <Routes>
        {/* Default route */}
       

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Signup route */}
        <Route path="/signup" element={<Register />} />

        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/orders" element={<PurchaseOrderTable/>}/>
        <Route path="/approver" element={<ApproverDashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
