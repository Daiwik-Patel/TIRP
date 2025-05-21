import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
import {
  FiUploadCloud,
  FiBarChart2,
  FiFileText,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

const LinkItem = ({ to, children }) => (
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

export default function Layout() {
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
          {/* <LinkItem to="/dashboard">
            <FaTachometerAlt className="w-5 h-5" />
            Dashboard
          </LinkItem> */}
          <LinkItem to="/upload">
            <FiUploadCloud className="w-5 h-5" />
            Upload
          </LinkItem>
          <LinkItem to="/visualize">
            <FiBarChart2 className="w-5 h-5" />
            Visualize
          </LinkItem>
          <LinkItem to="/reports">
            <FiFileText className="w-5 h-5" />
            Reports
          </LinkItem>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => nav("/")}
          className="mt-auto flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <FiLogOut className="w-5 h-5" />
          Log Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
