import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiCpu,
  FiUploadCloud,
  FiBarChart2,
  FiFileText,

  // FiSettings, // Removed
  FiShield, // Icon might still be used for branding, but the link is removed
  // FiActivity, // Removed
  // FiBell, // Removed
  FiLogOut,
} from "react-icons/fi";
import { FaTachometerAlt } from "react-icons/fa";

const ALink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-indigo-100 text-indigo-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function AdminLayout() {
  const nav = useNavigate();
  return (
    <div className="w-screen h-screen flex">
      <aside className="w-60 bg-white shadow-md border-r p-5 flex flex-col">
        {/* Branding */}
        <div className="flex items-center gap-2 text-indigo-700 text-2xl font-bold mb-8">
          <FiShield className="w-6 h-6" />
          <span className="tracking-wide">NetThreat</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <ALink to="/admin/dashboard">
            <FaTachometerAlt className="w-5 h-5" /> Dashboard
          </ALink>
          <ALink to="/admin/upload">
            <FiUploadCloud className="w-5 h-5" /> Upload
          </ALink>
          <ALink to="/admin/visualize">
            <FiBarChart2 className="w-5 h-5" /> Visualize
          </ALink>
          <ALink to="/admin/reports">
            <FiFileText className="w-5 h-5" /> Reports
          </ALink>
          <ALink to="/admin/users">
            <FiUsers className="w-5 h-5" /> Manage Users
          </ALink>
          {/* <ALink to="/admin/models">
            <FiCpu className="w-5 h-5" /> Manage Models
          </ALink> */}
          
          {/* Removed:
          <ALink to="/admin/config">
            <FiSettings className="w-5 h-5" /> System Config
          </ALink>
          <ALink to="/admin/security">
            <FiShield className="w-5 h-5" /> Security
          </ALink>
          <ALink to="/admin/monitoring">
            <FiActivity className="w-5 h-5" /> Monitoring
          </ALink>
          <ALink to="/admin/alerts">
            <FiBell className="w-5 h-5" /> Alerts
          </ALink>
          */}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => nav("/")}
          className="mt-auto flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <FiLogOut className="w-5 h-5" /> Log out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}