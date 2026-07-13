import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchAdmins, deleteAdmin, toggleAdminStatus } from '../../services/adminApi';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
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
        <Link to="/admin/admins/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg shadow-slate-700/10 hover:bg-slate-600">
            Create Admin
          </button>
        </Link>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto table-scroll-container">
          <table className="w-full text-sm">
            <thead className={`${scrolled ? 'bg-slate-700' : 'bg-slate-800'} text-slate-300 sticky top-0 z-10 backdrop-blur-sm transition-all duration-200`}>
              <tr>
                <th className="px-4 py-4 text-left font-medium">ID</th>
                <th className="px-4 py-4 text-left font-medium">Admin</th>
                <th className="px-4 py-4 text-left font-medium">Email</th>
                <th className="px-4 py-4 text-left font-medium">Roles</th>
                <th className="px-4 py-4 text-left font-medium">Status</th>
                <th className="px-4 py-4 text-left font-medium">Created</th>
                <th className="px-4 py-4 text-left font-medium">Last Login</th>
                <th className="px-4 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    Loading admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-slate-300">{admin.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          src={admin.imageUrl || defaultSelected}
                          alt="Admin Avatar"
                        />
                        <div>
                          <div className="font-semibold text-white">{admin.name}</div>
                          <div className="text-xs text-slate-400">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{admin.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {getRoleNames(admin.roles).split(', ').map((role, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        admin.isActive
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-red-900/30 text-red-300'
                      }`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-300">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/admins/edit/${admin.id}`}>
                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600">
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() => toggleStatusHandler(admin.id)}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
                            admin.isActive
                              ? 'border-amber-600 bg-amber-900/20 text-amber-300 hover:bg-amber-900/30'
                              : 'border-green-600 bg-green-900/20 text-green-300 hover:bg-green-900/30'
                          }`}
                        >
                          {admin.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          onClick={() => deleteAdminHandler(admin.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-600 bg-red-900/20 text-red-300 hover:bg-red-900/30"
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
