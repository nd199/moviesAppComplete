import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchAdminById, updateAdmin } from '../../services/adminApi';

const AdminEdit = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: '', phoneNumber: '', address: '', department: '', accessLevel: 1, isActive: true, imageUrl: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminData = await fetchAdminById(id);
        setAdmin(adminData);
        setFormData({ name: adminData.name || '', phoneNumber: adminData.phoneNumber || '', address: adminData.address || '', department: adminData.department || '', accessLevel: adminData.accessLevel || 1, isActive: adminData.isActive || true, imageUrl: adminData.imageUrl || '' });
      } catch (error) {
        toast.error('Failed to fetch admin data');
        navigate('/admin/admins');
      } finally { setLoading(false); }
    };
    fetchAdminData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateAdmin(id, formData);
      toast.success('Admin updated successfully');
      navigate('/admin/admins');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update admin');
    } finally { setUpdating(false); }
  };

  const inputClass = "w-full rounded-xl border border-surface-700 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all";

  if (loading) return <div className="flex justify-center items-center h-64"><div className="flex items-center gap-3 text-surface-500"><div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div><span className="text-sm">Loading admin data...</span></div></div>;
  if (!admin) return <div className="flex justify-center items-center h-64"><div className="text-red-400">Admin not found</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Edit Admin</h1>
          <p className="text-sm text-surface-500 mt-0.5">Update admin profile and access level</p>
        </div>
        <button onClick={() => navigate('/admin/admins')}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
          <HiArrowLeft className="h-4 w-4" />
          Back to Admins
        </button>
      </div>

      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-2xl">
        <div className="text-lg font-semibold text-white">Admin Profile</div>
        <div className="mt-1 text-sm text-surface-500">Email is read-only.</div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div><label className="block text-sm font-medium text-surface-500 mb-1">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required /></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-1">Email (Read-only)</label><input type="email" value={admin.email} disabled className={`${inputClass} !text-surface-500 cursor-not-allowed`} /></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-1">Phone Number</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} required /></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-1">Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows="3" className={`${inputClass} resize-none`} required /></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-1">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g., IT, HR, Finance" className={inputClass} /></div>
          <div>
            <label className="block text-sm font-medium text-surface-500 mb-1">Access Level</label>
            <select name="accessLevel" value={formData.accessLevel} onChange={handleChange} className={inputClass}>
              <option value={1}>Level 1 - Basic</option><option value={2}>Level 2 - Intermediate</option><option value={3}>Level 3 - Advanced</option><option value={4}>Level 4 - Super Admin</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-surface-500 mb-1">Profile Image URL</label><input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className={inputClass} /></div>

          <div className="flex items-center">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-brand-500 border-surface-700 rounded focus:ring-brand-500 bg-surface-800" />
            <label htmlFor="isActive" className="ml-2 text-sm text-white">Active Status</label>
          </div>

          <div className="flex items-center space-x-2 text-sm text-surface-500">
            <span>Current Roles:</span>
            <div className="flex gap-1">
              {admin.roles?.map(role => (
                <span key={role.name} className="px-2 py-1 rounded-lg text-xs font-semibold border border-surface-700 bg-surface-800 text-white">
                  {role.name.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/admins')} className="px-4 py-2 rounded-xl border border-surface-700 bg-surface-800 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">Cancel</button>
            <button type="submit" disabled={updating} className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 disabled:opacity-50 transition-all">
              {updating ? 'Updating...' : 'Update Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEdit;
