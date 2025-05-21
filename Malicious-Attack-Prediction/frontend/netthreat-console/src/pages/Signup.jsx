import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios"; // Make sure you have axios installed: npm install axios

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState(""); // For password confirmation
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(null); // Clear previous errors
    setSuccess(false); // Clear previous success state

    // Basic client-side validation (optional, Django will validate too)
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username,
        email,
        password,
        password2, // Send password2 for validation on the Django side
      });

      console.log("Signup successful:", response.data);
      setSuccess(true);
      // Optionally redirect after successful signup
      setTimeout(() => {
        navigate("/"); // Redirect to the login page
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Signup error:", err.response ? err.response.data : err.message);
      // Display specific errors from Django if available
      if (err.response && err.response.data) {
        // Handle common Django errors (e.g., non_field_errors, field-specific errors)
        if (err.response.data.password) {
            setError(err.response.data.password[0]); // Display first password error
        } else if (err.response.data.username) {
            setError(err.response.data.username[0]);
        } else if (err.response.data.email) {
            setError(err.response.data.email[0]);
        } else if (err.response.data.non_field_errors) {
            setError(err.response.data.non_field_errors[0]);
        } else {
            setError("An unexpected error occurred during signup.");
        }
      } else {
        setError("Network error or server unavailable.");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      {/* Main split panel */}
      <div className="bg-white lg:rounded-lg lg:shadow-lg w-full flex">
        {/* ───────── Left side (welcome) ───────── */}
        <div className="w-1/2 h-full bg-gray-900 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to NetThreat Console</h1>
          <p className="text-sm opacity-90 max-w-xs">
            Sign up to analyze and secure your systems from threats using
            intelligent malware detection.
          </p>
        </div>

        {/* ───────── Right side (signup form) ───────── */}
        <div className="w-1/2 h-full p-10 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6">Create an account</h2>

          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input // Add a field for password confirmation
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />

            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Use 8 or more characters</li>
              <li>• One uppercase, one lowercase</li>
              <li>• One number, one special character</li>
            </ul>

            {error && (
              <div className="text-red-600 text-sm mt-2">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm mt-2">Signup successful! Redirecting to login...</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
            >
              Create an account
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;