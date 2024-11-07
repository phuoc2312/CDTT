import React, { useEffect, useState } from 'react';
import UserService from '../../Service/UserService';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getList();
        if (response.status) {
          setUsers(response.users);
        } else {
          setError(response.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
    // Thêm logic chỉnh sửa ở đây
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-4">User ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Role</th> {/* Thêm cột Role */}
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-100">
              <td className="p-4 text-center">{user.id}</td>
              <td className="p-4 text-center">{user.name}</td>
              <td className="p-4 text-center">{user.email}</td>
              <td className="p-4 text-center">{user.phone || 'N/A'}</td>
              <td className="p-4 text-center">{user.roles  || 'N/A'}</td> {/* Hiển thị role nếu có */}
              <td className="p-4 text-center">
                <button
                  className="text-blue-500 hover:text-blue-700 mx-2"
                  onClick={() => handleEdit(user.id)}
                  title="Edit User"
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 mx-2"
                  onClick={() => handleDelete(user.id)}
                  title="Delete User"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
