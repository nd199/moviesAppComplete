import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchAdminById, updateAdmin } from '../../services/adminApi';

const AdminEdit = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    department: '',
    accessLevel: 1,
    isActive: true,
    imageUrl: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminData = await fetchAdminById(id);
        setAdmin(adminData);
        setFormData({
          name: adminData.name || '',
          phoneNumber: adminData.phoneNumber || '',
          address: adminData.address || '',
          department: adminData.department || '',
          accessLevel: adminData.accessLevel || 1,
          isActive: adminData.isActive || true,
          imageUrl: adminData.imageUrl || ''
        });
      } catch (error) {
        console.error("Error fetching admin:", error);
        toast.error('Failed to fetch admin data');
        navigate('/admin/admins');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateAdmin(id, formData);
      toast.success('Admin updated successfully');
      navigate('/admin/admins');
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error(error.response?.data?.message || 'Failed to update admin');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-300">Loading admin data...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-300">Admin not found</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Edit Admin</h1>
          <p className="text-sm text-slate-400">Update admin profile and access level</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/admins')}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
        >
          Back to Admins
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="text-lg font-semibold text-slate-100">Admin Profile</div>
        <div className="mt-1 text-sm text-slate-400">Email is read-only.</div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={admin.email}
              disabled
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full resize-none rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., IT, HR, Finance"
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Access Level
            </label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value={1}>Level 1 - Basic</option>
              <option value={2}>Level 2 - Intermediate</option>
              <option value={3}>Level 3 - Advanced</option>
              <option value={4}>Level 4 - Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Profile Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-red-500 border-white/20 rounded focus:ring-red-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-slate-300">
              Active Status
            </label>
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Current Roles:</span>
            <div className="flex gap-1">
              {admin.roles?.map(role => (
                <span key={role.name} className="px-2 py-1 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-slate-200">
                  {role.name.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/admins')}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEdit;
