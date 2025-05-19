// ================================
// 1. src/pages/admin/AdminLayout.jsx
// ================================
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiCpu, FiSettings, FiShield, FiActivity, FiBell, FiLogOut } from "react-icons/fi";
import { FaTachometerAlt } from "react-icons/fa";

const ALink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 transition ${isActive ? "bg-gray-200 font-semibold" : ""}`
    }
  >
    {children}
  </NavLink>
);

export default function AdminLayout() {
  const nav = useNavigate();
  return (
    <div className="w-screen h-screen flex">
      <aside className="w-60 bg-white shadow-lg p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">NetThreat</h1>
        <nav className="flex-1 space-y-1">
          <ALink to="/admin/dashboard"><FaTachometerAlt/> Dashboard</ALink>
          <ALink to="/admin/users"><FiUsers/> Manage Users</ALink>
          <ALink to="/admin/models"><FiCpu/> Manage Models</ALink>
          <ALink to="/admin/config"><FiSettings/> System Config</ALink>
          <ALink to="/admin/security"><FiShield/> Security</ALink>
          <ALink to="/admin/monitoring"><FiActivity/> Monitoring</ALink>
          <ALink to="/admin/alerts"><FiBell/> Alerts</ALink>
        </nav>
        <button onClick={()=>nav('/')} className="mt-auto flex items-center gap-2 text-red-600 hover:underline"><FiLogOut/> Log out</button>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6"><Outlet/></main>
    </div>
  );
}
