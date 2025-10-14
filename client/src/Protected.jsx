// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem("authToken");
//   const userRole = sessionStorage.getItem("userRole");
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     if (!token) {
//      toast.error("Please log in to access this page");
//       navigate("/", { replace: true });
//     } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//       toast.warning("You are not authorized to access this page");
//       if(userRole=="CREATOR") navigate("/dashboard", { replace: true });
//       else  navigate("/approver", { replace: true });
     
//     } else {
//       setIsAuthorized(true); 
//     }
//   }, [token, userRole, allowedRoles, navigate]);

  
//   return isAuthorized ? children : null;
// };

// export default ProtectedRoute;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const verifyRole = async () => {
      if (!token) {
        toast.error("Please log in to access this page");
        setRedirectPath("/"); // delay navigation
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/user/role", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch role");

        const data = await response.json();
        const role = data.role;
        sessionStorage.setItem("userRole", role);

        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
          toast.warning("You are not authorized to access this page");
          if (role === "CREATOR") setRedirectPath("/dashboard");
          else if (role === "APPROVER") setRedirectPath("/approver");
          else if(role=="ADMIN") setRedirectPath("/admin");
          return;
        }

        setIsAuthorized(true); // user is allowed
      } catch (error) {
        console.error(error);
        toast.error("Session expired or unauthorized");
        sessionStorage.clear();
        setRedirectPath("/");
      }
    };

    verifyRole();
  }, [token, allowedRoles]);

  // handle navigation after toast
  useEffect(() => {
    if (redirectPath) {
      const timer = setTimeout(() => navigate(redirectPath, { replace: true }), 200);
      return () => clearTimeout(timer);
    }
  }, [redirectPath, navigate]);

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
