import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchAdmins, deleteAdmin, toggleAdminStatus } from '../services/adminApi';
import useScrollHeader from '../hooks/useScrollHeader';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrolled = useScrollHeader();

  useEffect(() => {
    const fetchAdminList = async () => {
      setLoading(true);
      try {
        const adminsData = await fetchAdmins();
        setAdmins(adminsData);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error('Failed to fetch admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminList();
  }, []);

  const deleteAdminHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteAdmin(id);
        setAdmins(prev => prev.filter(admin => admin.id !== id));
        toast.success('Admin deleted successfully');
      } catch (err) {
        console.error("Failed to delete admin:", err);
        toast.error('Failed to delete admin');
      }
    }
  };

  const toggleStatusHandler = async (id) => {
    try {
      const updatedAdmin = await toggleAdminStatus(id);
      setAdmins(prev => prev.map(admin => 
        admin.id === id ? updatedAdmin : admin
      ));
      toast.success(`Admin ${updatedAdmin.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error("Failed to toggle admin status:", err);
      toast.error('Failed to toggle admin status');
    }
  };

  const defaultAdminPicture = [
    "https://picsum.photos/seed/admin1/100/100.jpg",
    "https://picsum.photos/seed/admin2/100/100.jpg",
  ];
  const defaultSelected =
    defaultAdminPicture[Math.floor(Math.random() * defaultAdminPicture.length)];

  const getRoleNames = (roles) => {
    return roles?.map(role => role.name.replace('ROLE_', '')).join(', ') || 'No roles';
  };

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Admins</h1>
          <p className="text-sm text-slate-400">Manage administrative access and roles</p>
        </div>
        <Link to="/admins/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500">
            Create Admin
          </button>
        </Link>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto table-scroll-container">
          <table className="w-full text-sm">
            <thead className={`${scrolled ? 'bg-slate-800/90' : 'bg-white/5'} text-slate-300 sticky top-0 z-10 backdrop-blur-sm transition-all duration-200`}>
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Admin</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">Roles</th>
                <th className="px-4 py-3 text-left font-medium">Access</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                    Loading admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-slate-300">{admin.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover mr-3 border border-white/10"
                          src={admin.imageUrl || defaultSelected}
                          alt="Admin Avatar"
                        />
                        <div>
                          <div className="font-semibold text-slate-100">{admin.name}</div>
                          <div className="text-xs text-slate-400">Created: {new Date(admin.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{admin.email}</td>
                    <td className="px-4 py-3 text-slate-300">{admin.phoneNumber}</td>
                    <td className="px-4 py-3 text-slate-300">{admin.department || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {getRoleNames(admin.roles)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
                        Level {admin.accessLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          admin.isActive
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100'
                            : 'border-red-500/30 bg-red-500/15 text-red-100'
                        }`}
                      >
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admins/edit/${admin.id}`}>
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" title="Edit Admin">
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() => toggleStatusHandler(admin.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                          title={admin.isActive ? 'Deactivate Admin' : 'Activate Admin'}
                        >
                          {admin.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          onClick={() => deleteAdminHandler(admin.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                          title="Delete Admin"
                        >
                          <FaTrash />
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

export default AdminList;
