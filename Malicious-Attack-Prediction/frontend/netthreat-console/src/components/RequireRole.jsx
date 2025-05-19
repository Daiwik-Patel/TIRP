// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// export default function RequireRole({ role }) {
//   const { role: current } = useAuth();
//   if (current === role) return <Outlet />;
//   // logged-in user of *other* role → route to their home
//   if (current === "admin") return <Navigate to="/admin/dashboard" replace />;
//   if (current === "user")  return <Navigate to="/dashboard" replace />;
//   // not logged in → Login
//   return <Navigate to="/" replace />;
// }
