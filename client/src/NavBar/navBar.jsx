import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Navbar({ menuItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = sessionStorage.getItem("userRole");

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  // Centralized path resolver — used both for navigation and active check
  const resolvePath = (item) => {
    const key = item.toLowerCase();
    if (key === "home") {
      if (userRole === "APPROVER") return "/approver";
      if (userRole === "CREATOR") return "/dashboard";
      if (userRole === "ADMIN") return "/admin";
      return "/";
    }
    if (key === "pos") return "/approver/pos";
    if (key === "orders") {
      if (userRole === "APPROVER") return "/approver/orders";
      if (userRole === "CREATOR") return "/orders";
      return "/orders";
    }
    // default: convert label to kebab path
    return `/${item.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const handleNavClick = (item) => {
    const path = resolvePath(item);
    navigate(path);
    setIsOpen(false);
  };

  // Helper to normalize path (remove trailing slash)
  const normalize = (p) => (p && p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);

  const currentPath = normalize(location.pathname || "/");

  const isActive = (itemPath) => {
    const p = normalize(itemPath);
    // If path is root '/', match exactly
    if (p === "/") return currentPath === "/";
    // Use startsWith so nested routes also highlight (e.g. /approver/orders/123)
    return currentPath === p || currentPath.startsWith(p + "/");
  };

  return (
    <>
      <nav className="w-full bg-[linear-gradient(200deg,_#0066EE_60%,_#9383FB_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div
            className="text-xl font-bold cursor-pointer"
            onClick={() => handleNavClick("home")}
          >
            MyApp
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-3 items-center">
            {menuItems.map((item, idx) => {
              const itemPath = resolvePath(item);
              const active = isActive(itemPath);

              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-lg font-semibold transition
                    ${active ? "bg-white text-blue-600" : "hover:bg-blue-700"}
                  `}
                >
                  {item}
                </button>
              );
            })}

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
            {menuItems.map((item, idx) => {
              const itemPath = resolvePath(item);
              const active = isActive(itemPath);

              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item)}
                  className={`rounded-lg px-3 py-2 text-left transition
                    ${active ? "bg-white text-blue-600" : "hover:bg-white hover:text-black"}
                  `}
                >
                  {item}
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 rounded-lg px-3 py-2 font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div>
        <Outlet />
      </div>
    </>
  );
}
