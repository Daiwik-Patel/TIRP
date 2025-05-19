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

const BASE_STATS = {
  totalUploads: 200,
  threatsDetected: 120,
  safeEntries: 80,
  anomalies: 15,
};

const randomIncrement = (base, min = 1, max = 10) =>
  base + Math.floor(Math.random() * (max - min + 1) + min);

const getUpdatedStats = () => ({
  totalUploads: randomIncrement(BASE_STATS.totalUploads),
  threatsDetected: randomIncrement(BASE_STATS.threatsDetected),
  safeEntries: randomIncrement(BASE_STATS.safeEntries),
  anomalies: randomIncrement(BASE_STATS.anomalies),
});

const getRandomLineChartData = () => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let base = 20;
  const data = labels.map(() => (base += Math.floor(Math.random() * 5 + 1)));

  return {
    labels,
    datasets: [
      {
        label: "Detections",
        data,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
};

const getRandomPieChartData = () => {
  const labels = ["DDoS Attack", "Ransomware", "Virus", "Port Scan", "Benign"];
  let remaining = 100;
  const values = labels.map((_, idx) => {
    if (idx === labels.length - 1) return remaining;
    const val = Math.floor(Math.random() * (remaining / 2)) + 5;
    remaining -= val;
    return val;
  });

  return {
    labels,
    datasets: [
      {
        data: values,
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
  };
};

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
  const [stats, setStats] = useState({});
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    setStats(getUpdatedStats());
    setLineChartData(getRandomLineChartData());
    setPieChartData(getRandomPieChartData());
  }, []);

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h2>

      <div className="flex flex-wrap gap-6">
        <StatCard label="Total uploads" value={stats.totalUploads} delta="+15% this week" icon={FiRefreshCw} />
        <StatCard label="Threats detected" value={stats.threatsDetected} delta="+3% this week" icon={FiRefreshCw} />
        <StatCard label="Safe entries" value={stats.safeEntries} delta="-0.9% this week" icon={FiRefreshCw} />
        <StatCard label="CPS anomalies" value={stats.anomalies} delta="+1.5% this week" icon={FiRefreshCw} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-md p-5">
          <h4 className="text-gray-600 text-sm mb-3 font-semibold">Detection Rate Over Time</h4>
          {lineChartData ? (
            <Line data={lineChartData} />
          ) : (
            <p className="text-gray-400 text-center mt-16">Loading chart...</p>
          )}
        </div>
        <div className="w-full lg:w-80 bg-white rounded-xl shadow-md p-5">
          <h4 className="text-gray-600 text-sm mb-3 font-semibold">Anomaly Distribution</h4>
          {pieChartData ? (
            <Pie data={pieChartData} />
          ) : (
            <p className="text-gray-400 text-center mt-16">Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
}
