import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";


import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
export default function Navbar({ menuItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole");
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole"); 
    navigate("/");
  };

  const handleNavClick = (item) => {
    let path = "";

    if (item.toLowerCase() === "home") {
    
      if (userRole === "APPROVER") path = "/approver";
      else if (userRole === "CREATOR") path = "/dashboard";
      else if(userRole=="ADMIN") path="/admin";
      else path = "/"; 
    }
    else if(item.toLowerCase()=="pos"){
      path='/approver/pos';
    } 
    else if(item.toLowerCase()=="orders"){
       if (userRole === "APPROVER") path = "/approver/orders";
      else if (userRole === "CREATOR") path = "/orders";
    }
    else {
     
      path = `/${item.toLowerCase().replace(/\s+/g, "-")}`;
    }

    navigate(path);
    setIsOpen(false);
  };
  return (
    <>
    <nav className="w-full bg-[linear-gradient(200deg,_#0066EE_60%,_#9383FB_100%)] text-white">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => handleNavClick("home")}
        >
          MyApp
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavClick(item)}
              className="font-semibold hover:text-gray-200 transition-colors"
            >
              {item}
            </button>
          ))}

          {/* 🚪 Logout button */}
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>

       
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-4 pb-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
             onClick={() => handleNavClick(item)}
              className="hover:bg-white hover:text-black rounded-lg px-3 py-2 text-left"
            >
              {item}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 rounded-lg px-3 py-2 font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
     <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
      </>
  );
}
