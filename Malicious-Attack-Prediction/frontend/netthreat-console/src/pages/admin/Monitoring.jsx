// ================================
// 5. src/pages/admin/Monitoring.jsx
// ================================
import React from "react";

export default function Monitoring() {
  return (
    <div className="bg-gray-900 text-white p-6 rounded shadow max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">System Monitoring</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {/* four dark cards */}
        <div className="bg-gray-800 p-4 rounded h-40 flex items-center justify-center text-gray-400">CPU Usage chart</div>
        <div className="bg-gray-800 p-4 rounded h-40 flex items-center justify-center text-gray-400">Memory Usage chart</div>
        <div className="bg-gray-800 p-4 rounded h-40 flex items-center justify-center text-gray-400">Network Usage chart</div>
        <div className="bg-gray-800 p-4 rounded h-40 flex items-center justify-center text-gray-400">ML Model Health</div>
      </div>
    </div>
  );
}