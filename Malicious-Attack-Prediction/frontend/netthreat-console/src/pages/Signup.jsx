import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
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

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Use 8 or more characters</li>
              <li>• One uppercase, one lowercase</li>
              <li>• One number, one special character</li>
            </ul>

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
