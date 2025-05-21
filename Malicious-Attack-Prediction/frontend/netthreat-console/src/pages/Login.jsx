import React, { useState } from "react";
import { FaGoogle, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "usernameOrEmail") {
      setUsernameOrEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setError(""); // Clear any previous error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Clear any previous error before a new attempt

    try {
      // Send login credentials to your Django backend
      const response = await axios.post("http://localhost:8000/api/login/", {
        // Django's default ObtainAuthToken view expects 'username' and 'password'
        // If your backend is configured to accept email for login, you might need
        // a custom Django login view/serializer. For now, we'll send it as 'username'.
        username: usernameOrEmail,
        password: password,
      });

      console.log("Login successful:", response.data);

      // Assuming Django returns a token like { "token": "your_auth_token_here" }
      const authToken = response.data.token;

      // Store the token (e.g., in localStorage) for future authenticated requests
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("username", response.data.username); // Store username if needed

      // Redirect to upload on successful login
      navigate('/upload');

    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);

      // Handle specific error messages from Django
      if (err.response && err.response.status === 400) {
        // This is common for invalid credentials
        if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0]); // e.g., "Unable to log in with provided credentials."
        } else if (err.response.data.username || err.response.data.password) {
          // If specific field errors are returned
          setError("Invalid username/email or password.");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else if (err.response && err.response.status === 401) {
          setError("Authentication failed. Please check your credentials.");
      }
      else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      {/* Main split panel */}
      <div className="bg-white lg:rounded-lg lg:shadow-lg w-full flex">
        {/* ───────── Left side (branding) ───────── */}
        <div className="w-1/2 h-full bg-gradient-to-br from-red-600 to-gray-800 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4">NetThreat Console</h1>
          <p className="text-sm opacity-90 max-w-xs">
            A secure platform to track malicious activity and protect your
            systems.
          </p>
        </div>

        {/* ───────── Right side (login form) ───────── */}
        <div className="w-1/2 h-full p-10 overflow-y-auto">
          {/* Header row */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <Link to="/admin/admin-login" className="text-sm text-blue-600 hover:underline">
              Sign in as <span className="font-bold">Admin</span>
            </Link>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <button className="flex items-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100">
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span className="text-sm">Continue with Google</span>
            </button>
            <button className="flex items-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100">
              <FaTwitter className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Continue with Twitter</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-xs text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Login form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={usernameOrEmail}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-sm text-blue-600 hover:underline"
            > {/* Changed button style for clarity, you can revert if needed */}
              Sign in
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;