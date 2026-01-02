import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import History from "./pages/History";

// import History from "./pages/History";  // enable when file ready

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">

        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/input" element={<InputForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={<History />} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Digital Twin of a Student — Built for Academic Excellence.
        </footer>
      </div>
    </Router>
  );
}
