// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function Reports() {
  const [reportList, setReportList] = useState([]);
  const [selectedReportData, setSelectedReportData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportList();
  }, []);

  const fetchReportList = async () => {
    try {
      const response = await fetch("/api/reports/"); // Your Django endpoint to list report files
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReportList(data.reports); // Assuming your Django endpoint returns { reports: ['filename1.json', 'filename2.json', ...] }
      setError(null);
    } catch (e) {
      setError("Failed to fetch report list.");
      console.error("Error fetching report list:", e);
    }
  };

  const fetchReportData = async (filename) => {
    try {
      const response = await fetch(`/api/reports/${filename}`); // Your Django endpoint to get report content
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedReportData(data);
      setError(null);
    } catch (e) {
      setError(`Failed to fetch report data for ${filename}.`);
      console.error(`Error fetching report data for ${filename}:`, e);
      setSelectedReportData(null);
    }
  };

  const generatePdf = () => {
    if (selectedReportData) {
      const doc = new jsPDF();
      let y = 20;
      const margin = 20;
      const lineHeight = 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Prediction Report Details", margin, y);
      y += lineHeight + 5;
      doc.setFont("helvetica", "normal");

      function addLine(text) {
        doc.text(text, margin, y);
        y += lineHeight;
        if (y > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = margin + lineHeight;
        }
      }

      for (const key in selectedReportData) {
        if (typeof selectedReportData[key] === 'object') {
          addLine(`${key}:`);
          const nestedObject = JSON.stringify(selectedReportData[key], null, 2).split('\n');
          nestedObject.forEach(line => {
            addLine(`  ${line}`);
          });
        } else {
          addLine(`${key}: ${selectedReportData[key]}`);
        }
      }

      doc.save("prediction_report.pdf");
    } else {
      alert("No report data to generate PDF.");
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Prediction Reports</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div>
        <h3 className="text-lg font-semibold mb-2">Available Reports:</h3>
        {reportList.length === 0 ? (
          <div className="text-gray-600">No reports available.</div>
        ) : (
          <ul className="list-disc pl-5 text-sm">
            {reportList.map((filename) => (
              <li key={filename}>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => fetchReportData(filename)}
                >
                  {filename}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedReportData && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Report Details:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(selectedReportData, null, 2)}
          </pre>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={generatePdf}
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}