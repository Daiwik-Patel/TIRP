import React from "react";
import { FaGoogle, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
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
            <button className="text-sm text-blue-600 hover:underline">
              Sign in as <span className="font-bold">Admin</span>
            </button>
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
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Username or Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
            >
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
