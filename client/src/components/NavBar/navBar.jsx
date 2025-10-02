import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[linear-gradient(200deg,_#0066EE_60%,_#9383FB_100%)] text-white">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo / Brand */}
        <div className="text-xl font-bold">MyApp</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a
            href="#home"
            className="hover:text-gray-200 transition-colors"
          >
            Home
          </a>
          <a
            href="#previous-order"
            className="hover:text-gray-200 transition-colors"
          >
            Previous Order
          </a>
        </div>

        {/* Mobile Menu Icon */}
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
          <a
            href="#home"
            className="hover:bg-white hover:text-black rounded-lg px-3 py-2"
          >
            Home
          </a>
          <a
            href="#previous-order"
            className="hover:bg-white hover:text-black rounded-lg px-3 py-2"
          >
            Previous Order
          </a>
        </div>
      )}
    </nav>
  );
}
