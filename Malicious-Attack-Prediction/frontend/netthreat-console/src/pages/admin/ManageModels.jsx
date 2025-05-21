import React, { useEffect, useState } from "react";

export default function ManageModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/admin/models/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setModels(data);
      } catch (e) {
        console.error("Failed to fetch models:", e);
        setError("Failed to load models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading models...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-xl text-red-700 p-4 rounded bg-red-100 border border-red-300">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-6xl mx-auto border border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-10 tracking-tight">
          Available Machine Learning Models
        </h2>

        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-blue-100 text-gray-700 uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Model Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Version</th>
                <th className="px-6 py-3 text-left">Accuracy</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {models.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No models found.
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr key={model.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{model.name}</td>
                    <td className="px-6 py-4">{model.model_type_display || model.model_type}</td>
                    <td className="px-6 py-4">{model.version || "N/A"}</td>
                    <td className="px-6 py-4">
                      {model.accuracy ? (model.accuracy * 100).toFixed(2) + "%" : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {model.is_active ? (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
