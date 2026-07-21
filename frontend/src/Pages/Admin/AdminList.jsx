import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from 'react-icons/fa';
import { HiShieldCheck, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchAdmins, deleteAdmin, toggleAdminStatus } from '../../services/adminApi';

const avatarGradients = [
  'from-brand-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
];

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getRoleNames = (roles) => {
    return roles?.map(role => (role.name || role).replace('ROLE_', '')).join(', ') || 'No roles';
  };

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.isActive).length;
  const superAdmins = admins.filter(a => a.roles?.some(r => (r.name || r) === 'ROLE_SUPER_ADMIN')).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Admins', value: totalAdmins, icon: HiShieldCheck, color: 'from-brand-600 to-brand-700' },
          { label: 'Active', value: activeAdmins, icon: HiCheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: 'Inactive', value: totalAdmins - activeAdmins, icon: HiXCircle, color: 'from-red-500 to-rose-500' },
          { label: 'Super Admins', value: superAdmins, icon: HiShieldCheck, color: 'from-amber-500 to-orange-500' },
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
      <div className="flex items-center justify-end">
        <Link to="/admin/admins/new">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <FaPlus className="h-3.5 w-3.5" />
            Create Admin
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
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Roles</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Last Login</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-surface-500">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading admins...</span>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                        <HiShieldCheck className="h-6 w-6 text-surface-500" />
                      </div>
                      <p className="text-surface-500 text-sm">No admins found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                admins.map((admin, idx) => (
                  <tr key={admin.id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="px-4 py-3 text-surface-500 font-mono text-xs">{admin.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center shadow-sm`}>
                          <span className="text-white text-xs font-bold">{admin.name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{admin.name}</div>
                          <div className="text-xs text-surface-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500">{admin.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {getRoleNames(admin.roles).split(', ').map((role, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                        admin.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/15 text-red-400 border border-red-500/20'
                      }`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/admins/edit/${admin.id}`}>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => toggleStatusHandler(admin.id)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                            admin.isActive
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {admin.isActive ? <FaToggleOff className="h-3.5 w-3.5" /> : <FaToggleOn className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteAdminHandler(admin.id)}
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

export default AdminList;
