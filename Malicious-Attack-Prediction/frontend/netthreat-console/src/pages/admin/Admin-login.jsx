import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa"; // Example admin icon

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading to true

    try {
      const response = await fetch("http://localhost:8000/api/admin/login/", { // Replace with your actual backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Admin login successful:", data);
        // Store the token (e.g., in localStorage or a more secure state management)
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUsername", data.username);
        // You might want to store other admin-related data like is_staff, is_superuser
        localStorage.setItem("isAdminStaff", data.is_staff);
        localStorage.setItem("isAdminSuperuser", data.is_superuser);

        navigate("/admin/dashboard"); // Navigate to the admin dashboard
      } else {
        // Handle backend errors (e.g., invalid credentials, no admin privileges)
        setError(data.detail || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Network error or unexpected error:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false); // Set loading back to false
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      {/* Main split panel */}
      <div className="bg-white lg:rounded-lg lg:shadow-lg w-full flex">
        {/* ───────── Left side (branding) ───────── */}
        <div className="w-1/2 h-full bg-gradient-to-br from-blue-600 to-gray-800 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4">Admin Access</h1>
          <div className="text-center mb-4">
            <FaShieldAlt className="w-16 h-16 mx-auto text-white opacity-90" />
          </div>
          <p className="text-sm opacity-90 max-w-xs">
            Secure administrative access to manage the NetThreat Console.
            Please enter your credentials.
          </p>
        </div>

        {/* ───────── Right side (login form) ───────── */}
        <div className="w-1/2 h-full p-10 overflow-y-auto">
          {/* Header row */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Admin Sign in</h2>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to <span className="font-bold">User Login</span>
            </Link>
          </div>

          {/* Login form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading} // Disable input during loading
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // Disable input during loading
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                disabled={loading} // Disable button during loading
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;