// ================================
// 7. src/pages/admin/Security.jsx
// ================================
import React from "react";

export default function Security() {
  return (
    <div className="bg-amber-50 shadow rounded p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Security Management</h2>

      <h3 className="font-semibold mb-2">Roles & Permissions</h3>
      <table className="min-w-full text-sm border mb-4">
        <thead className="bg-gray-100 text-left"><tr><th className="px-3 py-2">Role Name</th><th className="px-3 py-2">P1</th><th>P2</th><th>Edit</th></tr></thead>
        <tbody>
          {['Administrator','Editor','Viewer','Guest'].map(r=> (
            <tr key={r} className="border-t"><td className="px-3 py-2">{r}</td><td>✔️</td><td>✔️</td><td><button className="text-blue-600">Edit</button></td></tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-semibold mb-2">API Key Management</h3>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100 text-left"><tr><th className="px-3 py-2">API Key</th><th>Create / Rotate / Delete</th></tr></thead>
        <tbody>
          {[1,2,3,4].map(k=> (
            <tr key={k} className="border-t"><td className="px-3 py-2">API Key {k}</td><td className="space-x-2"><button className="text-blue-600">Rotate</button><button className="text-red-600">Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
