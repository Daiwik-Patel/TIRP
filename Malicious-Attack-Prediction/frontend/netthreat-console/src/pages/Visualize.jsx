import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const tabs = ["Confusion Matrix", "Feature Importance", "Heatmap"];

export default function Visualize() {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state?.prediction;

  useEffect(() => {
    if (!prediction) navigate("/upload");
  }, [prediction, navigate]);

  if (!prediction) return null;

  const { accuracy, classification_report, confusion_matrix, true_labels, predicted_labels } = prediction;

  const classKeys = Object.keys(classification_report || {}).filter(
    (k) => !["accuracy", "macro avg", "weighted avg"].includes(k)
  );

  const prfData = {
    labels: classKeys,
    datasets: [
      {
        label: "Precision",
        data: classKeys.map((c) => classification_report[c].precision),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Recall",
        data: classKeys.map((c) => classification_report[c].recall),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
      {
        label: "F1 Score",
        data: classKeys.map((c) => classification_report[c]["f1-score"]),
        backgroundColor: "rgba(255, 159, 64, 0.7)",
      },
    ],
  };

  const predCounts = predicted_labels?.reduce((acc, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = {
    labels: Object.keys(predCounts),
    datasets: [
      {
        data: Object.values(predCounts),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
      },
    ],
  };

  let confMatrixData = null;
  if (confusion_matrix && true_labels && predicted_labels) {
    const labels = Array.from(new Set([...true_labels, ...predicted_labels]));
    confMatrixData = {
      labels,
      datasets: labels.map((label, i) => ({
        label,
        data: confusion_matrix.map((row) => row[i]),
        backgroundColor: `hsl(${(i * 360) / labels.length}, 70%, 60%)`,
      })),
    };
  }

  // Function to save prediction data to localStorage
  function savePredictionToLocalStorage() {
    if (prediction) {
      localStorage.setItem("savedPrediction", JSON.stringify(prediction));
      alert("✅ Prediction report saved!");
    }
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 mt-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Prediction Results</h2>

      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md inline-block font-medium">
        ✅ Accuracy: {Math.round(accuracy * 100)}%
      </div>

        <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Precision</th>
              <th className="px-4 py-2">Recall</th>
              <th className="px-4 py-2">F1-Score</th>
              <th className="px-4 py-2">Support</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {classKeys.map((label) => (
              <tr key={label}>
                <td className="px-4 py-2">{label}</td>
                <td className="px-4 py-2">{classification_report[label]["precision"]?.toFixed(2)}</td>
                <td className="px-4 py-2">{classification_report[label]["recall"]?.toFixed(2)}</td>
                <td className="px-4 py-2">{classification_report[label]["f1-score"]?.toFixed(2)}</td>
                <td className="px-4 py-2">{classification_report[label]["support"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mt-4 mb-3">📈 Visualizations</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 shadow-sm border 
                ${
                  tab === i
                    ? "bg-blue-600 text-white border-blue-700 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-full h-[400px] bg-gray-50 rounded-lg shadow-inner flex items-center justify-center p-4">
          {tab === 0 && confMatrixData ? (
            <Bar
              data={confMatrixData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Confusion Matrix (Grouped Bar)" },
                },
                scales: {
                  x: { stacked: false },
                  y: { beginAtZero: true, stacked: false },
                },
              }}
            />
          ) : tab === 1 ? (
            <Bar
              data={prfData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Precision, Recall, F1-Score per Class" },
                },
                scales: {
                  y: { beginAtZero: true, max: 1 },
                },
              }}
            />
          ) : tab === 2 ? (
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "right" },
                  title: { display: true, text: "Prediction Distribution" },
                },
              }}
            />
          ) : (
            <div className="text-gray-400">No visualization available</div>
          )}
        </div>
      </div>
    </div>
  );
}
