import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchUsers, deleteUser } from '../../services/adminApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      setScrolled(e.target.scrollTop > 0);
    };
    const container = document.querySelector('.table-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const usersData = await fetchUsers();
        console.log('Raw user data from API:', usersData);
        const filteredUsers = usersData.filter(user => user.roles?.[0] !== 'ROLE_ADMIN');
        console.log('Filtered users:', filteredUsers);
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phoneNumber?.toLowerCase().includes(searchLower) ||
        user.address?.toLowerCase().includes(searchLower)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const deleteUserHandler = async (id) => {
    try {
      await deleteUser(id);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      toast.success('User deleted successfully');
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error('Failed to delete user');
    }
  };

  const defaultUserPicture = [
    "https://picsum.photos/seed/user1/100/100.jpg",
    "https://picsum.photos/seed/user2/100/100.jpg",
  ];
  const defaultSelected =
    defaultUserPicture[Math.floor(Math.random() * defaultUserPicture.length)];

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <Link to="/admin/users/new">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500"
            >
              Create User
            </button>
          </Link>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto table-scroll-container">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className={`${scrolled ? 'bg-slate-700' : 'bg-slate-800'} text-slate-300 sticky top-0 z-10 backdrop-blur-sm transition-all duration-200`}>
              <tr>
                <th className="px-4 py-4 text-left font-medium">ID</th>
                <th className="px-4 py-4 text-left font-medium">User</th>
                <th className="px-4 py-4 text-left font-medium">Email</th>
                <th className="px-4 py-4 text-left font-medium">Phone</th>
                <th className="px-4 py-4 text-left font-medium">Address</th>
                <th className="px-4 py-4 text-left font-medium">Created</th>
                <th className="px-4 py-4 text-left font-medium">Updated</th>
                <th className="px-4 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-slate-300">{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10 rounded-full object-cover mr-2.5"
                        src={user.imageUrl || defaultSelected}
                        alt="User Avatar"
                      />
                      <div>
                        <div className="font-semibold text-white">{user.name || 'N/A'}</div>
                        <div className="text-xs text-slate-400">{user.roles?.[0]?.replace('ROLE_', '') || 'USER'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3 text-slate-300">{user.phoneNumber || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{user.address || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() + ' ' + new Date(user.createdAt).toLocaleTimeString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() + ' ' + new Date(user.updatedAt).toLocaleTimeString() : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/users/edit/${user.id}`}>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteUserHandler(user.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-600 bg-red-900/20 text-red-300 hover:bg-red-900/30"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
