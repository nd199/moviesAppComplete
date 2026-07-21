import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { HiUserGroup, HiUser, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchUsers, deleteUser } from '../../services/adminApi';

const avatarGradients = [
  'from-brand-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const usersData = await fetchUsers();
        const filteredUsers = usersData.filter(user => user.roles?.[0] !== 'ROLE_ADMIN');
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

  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.isEmailVerified).length;
  const subscribedUsers = users.filter(u => u.isSubscribed).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: HiUserGroup, color: 'from-brand-600 to-brand-700' },
          { label: 'Verified', value: verifiedUsers, icon: HiCheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: 'Subscribed', value: subscribedUsers, icon: HiUser, color: 'from-accent-600 to-accent-700' },
          { label: 'Showing', value: filteredUsers.length, icon: HiXCircle, color: 'from-amber-500 to-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-900 border border-surface-700 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-900 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors text-sm w-72"
            />
          </div>
        </div>
        <Link to="/admin/users/new">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <FaPlus className="h-3.5 w-3.5" />
            Create User
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-surface-900 border border-surface-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-800 border-b border-surface-700">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-surface-500">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                        <HiUserGroup className="h-6 w-6 text-surface-500" />
                      </div>
                      <p className="text-surface-500 text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="px-4 py-3 text-surface-500 font-mono text-xs">{user.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center shadow-sm`}>
                          <span className="text-white text-xs font-bold">{user.name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name || '—'}</div>
                          <div className="text-xs text-surface-500">{user.roles?.[0]?.replace('ROLE_', '') || 'USER'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500">{user.email}</td>
                    <td className="px-4 py-3 text-surface-500">{user.phoneNumber || '—'}</td>
                    <td className="px-4 py-3 text-surface-500 max-w-xs truncate">{user.address || '—'}</td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/users/edit/${user.id}`}>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteUserHandler(user.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
