import React from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Input", path: "/input" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "History", path: "/history" },
  ];
  const handleLogout = () => {
  signOut(auth);
  window.location.href = "/login";
};

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-microchip text-white"></i>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              DigiTwin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  isActive(link.path) ? "text-indigo-600" : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Login/Signup Buttons */}
            {/* <Link
              to="/login"
              className="px-4 py-1.5 border border-indigo-500 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-md"
            >
              Register
            </Link> */}
            {auth.currentUser ? (
  <button onClick={handleLogout} className="px-4 py-1.5 bg-red-500 text-white rounded-lg">
    Logout
  </button>
) : (
  <>
    <Link to="/login" className="px-4 py-1.5 border border-indigo-500 text-indigo-600 rounded-lg">
      Login
    </Link>
    <Link to="/register" className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg">
      Register
    </Link>
  </>
)}


          </div>

          {/* Mobile Icon */}
          <div className="md:hidden">
            <i className="fas fa-bars text-slate-600 text-xl"></i>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
