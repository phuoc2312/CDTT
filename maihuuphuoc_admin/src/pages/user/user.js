import React, { useEffect, useState } from 'react';
import UserService from '../../Service/UserService'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await UserService.getList(); // Fetching users
        setUsers(result.user); // Adjust based on your API response structure
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/3 p-4">User ID</th>
            <th className="w-1/3 p-4">Name</th>
            <th className="w-1/3 p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-4">{user.id}</td>
              <td className="border p-4">{user.name}</td>
              <td className="border p-4">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Users;