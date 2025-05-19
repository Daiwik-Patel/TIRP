// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";

export default function Reports() {
  const [report, setReport] = useState(null);

  // Load from localStorage (or you can use context/backend fetch here)
  useEffect(() => {
    const savedPrediction = localStorage.getItem("lastPrediction");
    if (savedPrediction) {
      setReport(JSON.parse(savedPrediction));
    }
  }, []);

  return (
    <div className="bg-white shadow rounded p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Prediction Report</h2>

      {!report ? (
        <div className="text-gray-600">No report available</div>
      ) : (
        <>
          <div className="mb-4 text-sm">
            <div><span className="font-semibold">Accuracy:</span> {(report.accuracy * 100).toFixed(2)}%</div>
            <div><span className="font-semibold">Total Predictions:</span> {report.predicted_labels.length}</div>
            <div className="mt-2"><span className="font-semibold">Summary:</span></div>
            <ul className="list-disc pl-5 text-sm">
              {Object.entries(
                report.predicted_labels.reduce((acc, label) => {
                  acc[label] = (acc[label] || 0) + 1;
                  return acc;
                }, {})
              ).map(([label, count]) => (
                <li key={label}>
                  <strong>{label}:</strong> {count} predictions
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Class</th>
                  <th className="px-4 py-2">Precision</th>
                  <th className="px-4 py-2">Recall</th>
                  <th className="px-4 py-2">F1-Score</th>
                  <th className="px-4 py-2">Support</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.classification_report)
                  .filter(([k]) => !["accuracy", "macro avg", "weighted avg"].includes(k))
                  .map(([label, metrics]) => (
                    <tr key={label} className="border-t">
                      <td className="px-4 py-2">{label}</td>
                      <td className="px-4 py-2">{metrics.precision.toFixed(2)}</td>
                      <td className="px-4 py-2">{metrics.recall.toFixed(2)}</td>
                      <td className="px-4 py-2">{metrics["f1-score"].toFixed(2)}</td>
                      <td className="px-4 py-2">{metrics.support}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
