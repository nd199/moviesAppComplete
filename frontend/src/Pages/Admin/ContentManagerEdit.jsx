import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchContentManagerById, updateContentManager } from '../../services/adminApi';

const ContentManagerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', imageUrl: '', department: '', specialization: 'both', accessLevel: 1, isActive: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchContentManagerById(id);
        setFormData({ name: response.name || '', email: response.email || '', phoneNumber: response.phoneNumber || '', imageUrl: response.imageUrl || '', department: response.department || '', specialization: response.specialization || 'both', accessLevel: response.accessLevel || 1, isActive: response.isActive !== undefined ? response.isActive : true });
      } catch (error) {
        toast.error('Failed to fetch content manager details');
        navigate('/admin/content-managers');
      } finally { setFetchLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContentManager(id, formData);
      toast.success('Content manager updated successfully');
      navigate('/admin/content-managers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update content manager');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm";

  if (fetchLoading) return <div className="flex items-center justify-center h-64"><div className="flex items-center gap-3 text-surface-500"><div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div><span className="text-sm">Loading...</span></div></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Edit Content Manager</h1>
          <p className="text-sm text-surface-500 mt-0.5">Update content manager profile</p>
        </div>
        <button onClick={() => navigate('/admin/content-managers')}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
          <HiArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-sm font-medium text-surface-500 mb-2">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required /></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={`${inputClass} !text-surface-500 cursor-not-allowed`} required disabled /><p className="text-xs text-surface-500 mt-1">Email cannot be changed</p></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-2">Phone Number *</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} required /></div>
          <div><label className="block text-sm font-medium text-surface-500 mb-2">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className={inputClass} /></div>
          <div>
            <label className="block text-sm font-medium text-surface-500 mb-2">Specialization *</label>
            <select name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass} required>
              <option value="both">Movies & Shows</option><option value="movies">Movies Only</option><option value="shows">Shows Only</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-brand-500 border-surface-700 rounded focus:ring-brand-500 bg-surface-800" />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-white">Active Status</label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => navigate('/admin/content-managers')} className="px-4 py-2 rounded-xl border border-surface-700 bg-surface-800 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 disabled:opacity-50 transition-all">
              {loading ? 'Updating...' : 'Update Content Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManagerEdit;
