import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiRefreshCw } from "react-icons/fi";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const StatCard = ({ label, value, delta, icon: Icon }) => (
  <div className="flex-1 min-w-[12rem] bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300">
    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
      <span>{label}</span>
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
    </div>
    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    {delta && (
      <p className="flex items-center gap-1 text-xs text-green-600 mt-1">
        <FiArrowUpRight /> {delta}
      </p>
    )}
  </div>
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with the actual URL of your Django API endpoint to fetch dashboard data
        const response = await fetch("http://127.0.0.1:8000/api/dashboard-data/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Optionally, you can set up an interval to refresh the data periodically
    // const intervalId = setInterval(fetchDashboardData, 5000); // Fetch every 5 seconds
    // return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading dashboard data...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">Error loading dashboard data: {error}</p>;
  }

  if (!dashboardData) {
    return <p className="p-6 text-center text-gray-400">No dashboard data available.</p>;
  }

  const { total_uploads, threats_detected, safe_entries, anomalies, detection_rate_over_time, anomaly_distribution } = dashboardData;

  const lineChartData = detection_rate_over_time
  ? {
      labels: Object.keys(detection_rate_over_time),
      datasets: [
        {
          label: "Detections",
          data: Object.values(detection_rate_over_time),
          borderColor: "#4F46E5",
          backgroundColor: "rgba(79,70,229,0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    }
  : null;

const pieChartData = anomaly_distribution
  ? {
      labels: Object.keys(anomaly_distribution),
      datasets: [
        {
          data: Object.values(anomaly_distribution),
          backgroundColor: [
            "#ef4444",
            "#f97316",
            "#eab308",
            "#3b82f6",
            "#10b981",
          ],
          borderWidth: 1,
        },
      ],
    }
  : null;


  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h2>

      <div className="flex flex-wrap gap-6">
        <StatCard label="Total uploads" value={total_uploads || 0} icon={FiRefreshCw} />
        <StatCard label="Threats detected" value={threats_detected || 0} icon={FiRefreshCw} />
        <StatCard label="Safe entries" value={safe_entries || 0} icon={FiRefreshCw} />
        <StatCard label="CPS anomalies" value={anomalies || 0} icon={FiRefreshCw} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-md p-5">
          <h4 className="text-gray-600 text-sm mb-3 font-semibold">Detection Rate Over Time</h4>
          {lineChartData ? (
            <Line data={lineChartData} />
          ) : (
            <p className="text-gray-400 text-center mt-16">No detection rate data available.</p>
          )}
        </div>
        <div className="w-full lg:w-80 bg-white rounded-xl shadow-md p-5">
          <h4 className="text-gray-600 text-sm mb-3 font-semibold">Anomaly Distribution</h4>
          {pieChartData ? (
            <Pie data={pieChartData} />
          ) : (
            <p className="text-gray-400 text-center mt-16">No anomaly distribution data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}