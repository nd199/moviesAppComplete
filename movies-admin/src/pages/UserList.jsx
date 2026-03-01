import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchUsers, deleteUser } from '../services/adminApi';
import useSimpleScroll from '../hooks/useSimpleScroll';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scrolled = useSimpleScroll();

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const usersData = await fetchUsers();
        console.log('Raw user data from API:', usersData);
        // Filter out admin users
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

  // Search functionality
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

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "imageUrl",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full object-cover mr-2.5"
              src={params.row.imageUrl || defaultSelected}
              alt="User Avatar"
            />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "createdAt", headerName: "Created On", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="flex gap-2">
            <Link to={`/users/edit/${params.row.id}`}>
              <FaEdit 
                className="text-2xl m-0 rounded-lg bg-green-600 p-0.5 text-white cursor-pointer" 
              />
            </Link>
            <FaTrash
              className="bg-red-600 text-2xl rounded-lg p-0.5 text-white cursor-pointer"
              onClick={() => deleteUserHandler(params.row.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Users</h1>
          <p className="text-sm text-slate-400">Manage your OTT platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/20 transition-colors"
          />
          <Link to="/users/new">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500"
            >
              Create User
            </button>
          </Link>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className={`${scrolled ? 'bg-slate-800/90' : 'bg-white/5'} text-slate-300 sticky top-0 z-10 backdrop-blur-sm transition-all duration-200`}>
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
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-slate-300">{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10 rounded-full object-cover mr-2.5"
                        src={user.imageUrl || defaultSelected}
                        alt="User Avatar"
                      />
                      <div>
                        <div className="font-semibold text-slate-100">{user.name || 'N/A'}</div>
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
                      <Link to={`/users/edit/${user.id}`}>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteUserHandler(user.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
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
