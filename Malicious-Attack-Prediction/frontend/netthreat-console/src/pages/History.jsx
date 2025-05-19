import React from "react";

export default function History() {
  return (
    <div className="bg-white shadow rounded p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">History</h2>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-2">Run ID</th>
            <th className="px-4 py-2">Date/Time</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Data Source</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">RUN-2024-001</td>
            <td className="px-4 py-2">2024-10-27 10:30</td>
            <td className="px-4 py-2">User1</td>
            <td className="px-4 py-2">network_log.pcap</td>
            <td className="px-4 py-2">Completed</td>
            <td className="px-4 py-2 text-green-600">Completed</td>
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2">RUN-2024-002</td>
            <td className="px-4 py-2">2024-10-27 11:15</td>
            <td className="px-4 py-2">User2</td>
            <td className="px-4 py-2">malware.exe</td>
            <td className="px-4 py-2">Completed</td>
            <td className="px-4 py-2 text-green-600">Completed</td>
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2">RUN-2024-003</td>
            <td className="px-4 py-2">2024-10-27 12:45</td>
            <td className="px-4 py-2">User1</td>
            <td className="px-4 py-2">sensor.csv</td>
            <td className="px-4 py-2">Failed</td>
            <td className="px-4 py-2 text-red-600">Failed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}