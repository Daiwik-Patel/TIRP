// ================================
// 2. src/pages/admin/AdminDashboard.jsx
// ================================
// AdminDashboard.jsx  (very top)
import {
  FiUsers,
  FiCpu,
  FiSettings,
  FiShield,
  FiActivity,
  FiBell,
} from "react-icons/fi";




const Stat = ({ label, value, desc, icon: Icon }) => (
  <div className="flex-1 bg-white shadow rounded p-4 min-w-[10rem]">
    <div className="flex items-center justify-between mb-1 text-sm text-gray-500">
      <span>{label}</span>
      <Icon className="w-4 h-4 text-gray-400" />
    </div>
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Welcome Back, Admin</h2>
      <p className="text-sm text-gray-500">Here is the information about all your datasets</p>

      <div className="flex flex-wrap gap-4">
        <Stat label="Manage users"  value="15"   desc="User count, recent activity"       icon={FiUsers}/>
        <Stat label="Manage models" value="48"   desc="Model count, accuracy"            icon={FiCpu}/>
        <Stat label="System Config" value="1,850" desc="Key settings, recent changes"     icon={FiSettings}/>
        <Stat label="Security"      value="12"   desc="Alerts, user roles"               icon={FiShield}/>
      </div>

      <div className="flex flex-wrap gap-4">
        <Stat label="Monitoring" value="275" desc="CPU, memory usage" icon={FiActivity}/>
        <Stat label="Alerts"     value="13"  desc="Active alerts"     icon={FiBell}/>
      </div>

      <div className="bg-white shadow rounded p-4 h-64 flex items-center justify-center text-gray-400">
        System Resource Usage Graph (placeholder)
      </div>
    </div>
  );
}
