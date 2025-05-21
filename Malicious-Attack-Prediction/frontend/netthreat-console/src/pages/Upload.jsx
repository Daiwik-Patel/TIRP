import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file first");
      return;
    }

    var formData = new FormData();
    formData.append("file", file);

    

    try {
      setLoading(true);

      console.log(formData);
      
      const response = await axios.post("/api/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/visualize", { state: { prediction: response.data } });
    } catch (error) {
      alert("Prediction failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
          <FiUploadCloud className="text-blue-600" size={32} />
          Upload File for Prediction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Input */}
          <label
            htmlFor="file-upload"
            className="block border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition"
          >
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FiUploadCloud size={40} className="mb-2 text-blue-500" />
              {file ? (
                <span className="text-sm truncate max-w-xs text-center text-gray-800">
                  {file.name}
                </span>
              ) : (
                <span className="text-sm text-gray-600">Click to select a CSV or TXT file</span>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300
              ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"}
            `}
          >
            {loading ? "🔄 Predicting..." : "🚀 Upload & Predict"}
          </button>
        </form>

        {/* Loading Feedback */}
        {loading && (
          <div className="mt-6 text-center text-blue-600 font-medium animate-pulse">
            Processing your file and generating predictions...
          </div>
        )}
      </div>
    </div>
  );
}
