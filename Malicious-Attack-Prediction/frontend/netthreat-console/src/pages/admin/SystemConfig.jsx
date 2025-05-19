// ================================
// 4. src/pages/admin/SystemConfig.jsx
// ================================
import React from "react";

export default function SystemConfig() {
  return (
    <div className="bg-white shadow rounded p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">System Configuration</h2>
      {/* Threshold sliders */}
      <div>
        <h3 className="font-semibold mb-2">Threshold Sliders</h3>
        <label className="block mb-4">Reconstruction Error Threshold <input type="range" className="w-full" /></label>
        <label className="block mb-4">Confidence Threshold <input type="range" className="w-full" /></label>
        <label className="block">Alert Severity Threshold <input type="range" className="w-full" /></label>
      </div>
      {/* Logging settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Log Level</label>
          <select className="w-full border rounded px-2 py-1"><option>INFO</option><option>DEBUG</option></select>
        </div>
        <div>
          <label className="block text-sm">Log Rotation</label>
          <select className="w-full border rounded px-2 py-1"><option>Daily</option><option>Hourly</option></select>
        </div>
        <div>
          <label className="block text-sm">Log Retention</label>
          <select className="w-full border rounded px-2 py-1"><option>Automatic</option><option>Manual</option></select>
        </div>
        <div>
          <label className="block text-sm">Preprocessing Options</label>
          <select className="w-full border rounded px-2 py-1"><option>Standard</option><option>Custom</option></select>
        </div>
      </div>
      <button className="bg-blue-900 text-white px-4 py-2 rounded">Save Changes</button>
    </div>
  );
}
