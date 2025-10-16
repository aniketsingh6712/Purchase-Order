import React, { useState } from "react";

const AdminUserTable = ({ users, onChangeRole, onDeleteUser }) => {
  const userList = Array.isArray(users) ? users : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const recordsPerPage = 10;

  // Filter users based on search query (username OR email)
  const filteredRecords = userList.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Reset to first page if search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      <div className="flex justify-between ps-5 pe-5 pb-2">
        <h2 className="text-lg font-semibold text-blue-700">
          User Management
        </h2>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {currentRecords.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse text-blue-600">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Username</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-blue-600 hover:bg-gray-50 transition text-black"
                  >
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4 font-semibold">
                      <span
                        className={`px-2 py-1 rounded-md ${
                          user.role === "CREATOR"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex items-center">
                      <select
                        value={user.role}
                        onChange={(e) => onChangeRole(user._id, e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CREATOR">CREATOR</option>
                        <option value="APPROVER">APPROVER</option>
                      </select>

                      <button
                        onClick={() => onDeleteUser(user._id)}
                        className="ml-3 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              Prev
            </button>
            <span className="text-sm text-blue-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserTable;
