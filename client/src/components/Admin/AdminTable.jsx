import React from "react";

const AdminUserTable = ({ users, onChangeRole, onDeleteUser }) => {
  const userList = Array.isArray(users) ? users : [];

  return (
    <div className="relative mt-6 p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">
        User Management
      </h2>

      {userList.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
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
              {userList.map((user) => (
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
                  <td className="py-2 px-4">
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
      )}
    </div>
  );
};

export default AdminUserTable;
