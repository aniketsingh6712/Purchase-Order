import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminUserTable from "./AdminTable";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
   const token = sessionStorage.getItem("authToken"); 
  // Base URL for your backend API
  const API_BASE = "http://localhost:3001/api/admin";

  //  Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
      console.log(res);
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users:", error);
        toast.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  Handle role change
  const handleChangeRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE}/${userId}/role`, { role: newRole },
         {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success("user role now has been changed");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error);
    }
  };

  //  Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user")) return;
    try {
      await axios.delete(`${API_BASE}/${userId}`,
         {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User is now deleted");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error);
    }
  };

  return (
    <>
       
        <h2 className="text-3xl font-bold text-blue-600 my-3 ms-4">
          Admin Dashboard
        </h2>
      <AdminUserTable
        users={users}
        onChangeRole={handleChangeRole}
        onDeleteUser={handleDeleteUser}
      />
    </>
  );
};

export default AdminDashboard;
