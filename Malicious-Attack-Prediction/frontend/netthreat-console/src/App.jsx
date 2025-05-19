import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


/* PUBLIC */
import Login   from "./pages/Login";
import Signup  from "./pages/Signup";

/* USER side */
import Layout          from "./pages/Layout";
import Dashboard       from "./pages/Dashboard";
import Upload          from "./pages/Upload";
import Visualize       from "./pages/Visualize";
import Reports         from "./pages/Reports";
import History         from "./pages/History";

/* ADMIN side */
import AdminLayout     from "./pages/admin/AdminLayout";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import ManageUsers     from "./pages/admin/ManageUsers";
import ManageModels    from "./pages/admin/ManageModels";
import SystemConfig    from "./pages/admin/SystemConfig";
import Monitoring      from "./pages/admin/Monitoring";
import Security        from "./pages/admin/Security";
import Alerts          from "./pages/admin/Alerts";

/* Guard wrapper */


export default function App() {
         // just to know where to redirect root

  return (
    <BrowserRouter>
      <Routes>
        {/* ───── Public │ Login & Sign-up ───── */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ───── USER side (role = user) ───── */}
        <Route>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload"    element={<Upload />} />
            <Route path="/visualize" element={<Visualize />} />
            <Route path="/reports"   element={<Reports />} />
            <Route path="/history"   element={<History />} />
          </Route>
        </Route>

        {/* ───── ADMIN side (role = admin) ───── */}
        
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />
            <Route path="/admin/users"      element={<ManageUsers />} />
            <Route path="/admin/models"     element={<ManageModels />} />
            <Route path="/admin/config"     element={<SystemConfig />} />
            <Route path="/admin/monitoring" element={<Monitoring />} />
            <Route path="/admin/security"   element={<Security />} />
            <Route path="/admin/alerts"     element={<Alerts />} />
          </Route>
        

        {/* ───── Fallback ───── */}
        
         
      </Routes>
    </BrowserRouter>
  );
}
