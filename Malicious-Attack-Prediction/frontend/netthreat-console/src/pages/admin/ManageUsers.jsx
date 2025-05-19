// ================================
// 3. src/pages/admin/ManageUsers.jsx
// ================================
import React, { useState } from "react";

const initial = [
  { id: 1, name: "Daiwik P.", email: "daiwik@153.com", role: "Admin",    status: "Active"   },
  { id: 2, name: "Jinmei Li", email: "jinmei@342.com", role: "User",     status: "Active"   },
  { id: 3, name: "Manthila Bandara", email: "manthi@834.com", role: "Analyst", status: "Inactive" },
];

export default function ManageUsers() {
  const [rows, setRows] = useState(initial);
  return (
    <div className="bg-white shadow rounded p-6 w-full max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Manage Users</h2>

      <input placeholder="Search by name, email, role" className="w-full border px-3 py-2 rounded" />

      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left"><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th/></tr></thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{r.email}</td>
              <td className="px-3 py-2">{r.role}</td>
              <td className="px-3 py-2">{r.status}</td>
              <td className="px-3 py-2 text-blue-600 cursor-pointer">Edit</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="block mx-auto bg-gray-200 px-6 py-2 rounded">Add User</button>
    </div>
  );
}