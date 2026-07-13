import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchContentManagerById, updateContentManager } from '../../services/adminApi';

const ContentManagerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    imageUrl: '',
    department: '',
    specialization: 'both',
    accessLevel: 1,
    isActive: true
  });

  useEffect(() => {
    fetchContentManagerData();
  }, [id]);

  const fetchContentManagerData = async () => {
    try {
      const response = await fetchContentManagerById(id);
      setFormData({
        name: response.name || '',
        email: response.email || '',
        phoneNumber: response.phoneNumber || '',
        imageUrl: response.imageUrl || '',
        department: response.department || '',
        specialization: response.specialization || 'both',
        accessLevel: response.accessLevel || 1,
        isActive: response.isActive !== undefined ? response.isActive : true
      });
    } catch (error) {
      console.error('Failed to fetch content manager details:', error);
      toast.error('Failed to fetch content manager details');
      navigate('/admin/content-managers');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateContentManager(id, formData);
      toast.success('Content manager updated successfully');
      navigate('/admin/content-managers');
    } catch (error) {
      console.error('Failed to update content manager:', error);
      toast.error(error.response?.data?.message || 'Failed to update content manager');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Edit Content Manager</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Specialization *</label>
              <select name="specialization" value={formData.specialization} onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="both">Movies & Shows</option>
                <option value="movies">Movies Only</option>
                <option value="shows">Shows Only</option>
              </select>
            </div>

            <div className="flex items-center">
              <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500" />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-300">Active Status</label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/admin/content-managers')}
              className="px-4 py-2 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-700">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-md hover:from-green-600 hover:to-teal-700 disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Content Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManagerEdit;
