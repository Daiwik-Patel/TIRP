
// src/pages/admin/Alerts.jsx
import React from "react";
import {
  FiChevronDown,
  FiCheck,
  FiX,
  FiEye,
  FiFilter,
} from "react-icons/fi";

const data = [
  {
    id: "ALERT-001",
    time: "2024-10-27 10:30:00",
    severity: "High",
    desc: "DDoS attack detected on port 80",
    status: "New",
  },
  {
    id: "ALERT-002",
    time: "2024-10-27 11:15:00",
    severity: "Medium",
    desc: "Suspicious executable detected in downloads",
    status: "Acknowledged",
  },
];

const SeverityPill = ({ level }) => {
  const color =
    level === "High"
      ? "bg-red-600"
      : level === "Medium"
      ? "bg-yellow-600"
      : "bg-green-600";
  return (
    <span
      className={`${color} text-white text-xs px-2 py-0.5 rounded shadow inline-block`}
    >
      {level}
    </span>
  );
};

export default function Alerts() {
  return (
    <div className="bg-gray-900 text-white p-6 rounded shadow max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Alerts</h2>
        <FiFilter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["Severity", "Time Range", "Source", "New, Acknowledged, Resolved"].map(
          (label) => (
            <button
              key={label}
              className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded text-sm"
            >
              {label}
              <FiChevronDown className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="py-2 px-3">Alert ID</th>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Severity</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr key={a.id} className="border-b border-gray-800">
                <td className="px-3 py-2">{a.id}</td>
                <td className="px-3 py-2">{a.time}</td>
                <td className="px-3 py-2">
                  <SeverityPill level={a.severity} />
                </td>
                <td className="px-3 py-2">{a.desc}</td>
                <td className="px-3 py-2 space-x-2">
                  <button className="bg-blue-700 hover:bg-blue-600 px-2 py-0.5 rounded text-xs inline-flex items-center gap-1">
                    <FiCheck /> Acknowledge
                  </button>
                  <button className="bg-green-700 hover:bg-green-600 px-2 py-0.5 rounded text-xs inline-flex items-center gap-1">
                    <FiX /> Resolve
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded text-xs inline-flex items-center gap-1">
                    <FiEye /> View&nbsp;Details
                  </button>
                </td>
              </tr>
            ))}
            {/* extra placeholder rows */}
            {[...Array(2)].map((_, i) => (
              <tr key={i} className="border-b border-gray-800 text-gray-600">
                <td className="px-3 py-2">…</td>
                <td className="px-3 py-2">…</td>
                <td className="px-3 py-2">…</td>
                <td className="px-3 py-2">…</td>
                <td className="px-3 py-2">…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
