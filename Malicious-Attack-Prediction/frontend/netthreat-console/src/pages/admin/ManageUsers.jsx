import React, { useState, useEffect } from "react";

export default function ManageUsers() {
  const [rows, setRows] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Direct fetch call without any authentication headers
        // Ensure this URL matches your Django backend's user list endpoint
        const response = await fetch("http://localhost:8000/api/users/");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Map the data from the serializer to your desired frontend structure
        const formattedData = data.map(user => ({
          id: user.id,
          name: user.username, // Using 'username' from your backend data
          email: user.email,
          // Determine the role based on is_staff and is_superuser
          role: user.is_superuser ? "Admin" : (user.is_staff ? "Staff" : "User"),
          status: user.last_login ? "Active" : "Inactive" // Example: Consider active if they have a last_login
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // The empty array ensures this effect runs only once after the initial render

  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleEditUser = (userId) => {
    // Implement your edit logic here, e.g., navigate to an edit page or open a modal
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId) => {
    // Implement your delete logic here, e.g., show a confirmation modal and then delete
    console.log("Delete user:", userId);
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Perform deletion
      console.log(`User ${userId} deleted.`);
      // Optimistically update UI or re-fetch users
      setRows(rows.filter(row => row.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white shadow rounded-lg p-6 w-full max-w-3xl mx-auto">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-3xl mx-auto" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline ml-2">{error}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Manage Users</h2>

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRows.length > 0 ? (
              filteredRows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700">{r.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.role === "Admin" ? "bg-purple-100 text-purple-800" :
                      r.role === "Staff" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {r.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEditUser(r.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(r.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200 font-medium"
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
        Add New User
      </button>
    </div>
  );
}