import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  const userRole = sessionStorage.getItem("userRole");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!token) {
     toast.error("Please log in to access this page");
      navigate("/", { replace: true });
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      toast.warning("You are not authorized to access this page");
      if(userRole=="CREATOR") navigate("/dashboard", { replace: true });
      else  navigate("/approver", { replace: true });
     
    } else {
      setIsAuthorized(true); 
    }
  }, [token, userRole, allowedRoles, navigate]);

  
  return isAuthorized ? children : null;
};

export default ProtectedRoute;

