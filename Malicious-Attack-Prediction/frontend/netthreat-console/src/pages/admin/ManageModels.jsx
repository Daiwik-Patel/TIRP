// ================================
// 6. src/pages/admin/ManageModels.jsx
// ================================
import React from "react";

export default function ManageModels() {
  return (
    <div className="bg-white shadow rounded p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Manage Models</h2>

      <div className="flex gap-2">
        <input type="file" className="border px-2 py-1 flex-1" />
        <input type="text" placeholder="Model Name" className="border px-2 py-1 flex-1" />
        <button className="bg-black text-white px-4">Upload</button>
      </div>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-50 text-left"><tr><th className="px-3 py-2">Model Name</th><th>Version</th><th>Accuracy</th><th>Active Status</th><th/></tr></thead>
        <tbody>
          <tr className="border-t"><td className="px-3 py-2">Random Forest</td><td>1.0</td><td>0.95</td><td><button className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Set Active</button></td><td><button className="text-red-600">Rollback</button></td></tr>
          <tr className="border-t"><td className="px-3 py-2">Autoencoder</td><td>1.2</td><td>0.92</td><td><span className="bg-gray-200 px-2 py-0.5 rounded">Inactive</span></td><td><button className="text-red-600">Rollback</button></td></tr>
        </tbody>
      </table>
    </div>
  );
}
