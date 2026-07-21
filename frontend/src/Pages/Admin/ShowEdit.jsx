import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchShowById, updateShow } from '../../services/adminApi';

const ShowEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', rating: '', description: '', poster: '', ageRating: '', year: '', runtime: '', genre: '', category: 'General' });

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const showData = await fetchShowById(id);
        setFormData({ name: showData.name || '', rating: showData.rating || '', description: showData.description || '', poster: showData.poster || '', ageRating: showData.ageRating || '', year: showData.year || '', runtime: showData.runtime || '', genre: showData.genre || '', category: showData.category || 'General' });
      } catch (error) {
        toast.error('Failed to fetch show details');
        navigate('/admin/shows');
      } finally { setFetchLoading(false); }
    };
    fetchShowData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'rating' || name === 'year' ? (value === '' ? '' : Number(value)) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name || !formData.rating || !formData.description || !formData.poster || !formData.ageRating || !formData.year || !formData.runtime || !formData.genre) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }
      await updateShow(id, formData);
      toast.success('Show updated successfully');
      navigate('/admin/shows');
    } catch (error) {
      toast.error('Failed to update show');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors text-sm";

  if (fetchLoading) return <div className="flex items-center justify-center h-64"><div className="flex items-center gap-3 text-surface-500"><div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div><span className="text-sm">Loading show...</span></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Edit Show</h1>
          <p className="text-sm text-surface-500 mt-0.5">Update show information and details</p>
        </div>
        <button onClick={() => navigate('/admin/shows')}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
          <HiArrowLeft className="h-4 w-4" />
          Back to Shows
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className="block text-sm font-medium text-surface-500 mb-2">Show Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Breaking Bad" className={inputClass} required /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-2">Rating *</label><input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="8.5" step="0.1" min="0" max="10" className={inputClass} required /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-2">Year *</label><input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="2008" min="1900" max="2030" className={inputClass} required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-surface-500 mb-2">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter show description..." rows={4} className={`${inputClass} resize-none`} required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-surface-500 mb-2">Poster URL *</label><input type="url" name="poster" value={formData.poster} onChange={handleChange} placeholder="https://example.com/poster.jpg" className={inputClass} required /></div>
              <div>
                <label className="block text-sm font-medium text-surface-500 mb-2">Age Rating *</label>
                <select name="ageRating" value={formData.ageRating} onChange={handleChange} className={inputClass} required>
                  <option value="">Select age rating</option>
                  <option value="G">G</option><option value="PG">PG</option><option value="PG-13">PG-13</option><option value="R">R</option>
                  <option value="TV-Y">TV-Y</option><option value="TV-Y7">TV-Y7</option><option value="TV-G">TV-G</option><option value="TV-PG">TV-PG</option><option value="TV-14">TV-14</option><option value="TV-MA">TV-MA</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-surface-500 mb-2">Runtime *</label><input type="text" name="runtime" value={formData.runtime} onChange={handleChange} placeholder="e.g., 47 min or 2h 30min" className={inputClass} required /></div>
              <div><label className="block text-sm font-medium text-surface-500 mb-2">Genre *</label><input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="e.g., Crime, Drama, Thriller" className={inputClass} required /></div>
              <div>
                <label className="block text-sm font-medium text-surface-500 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass} required>
                  <option value="General">General</option><option value="Action">Action</option><option value="Comedy">Comedy</option><option value="Drama">Drama</option><option value="Horror">Horror</option><option value="Sci-Fi">Sci-Fi</option><option value="Romance">Romance</option><option value="Thriller">Thriller</option><option value="Documentary">Documentary</option><option value="Animation">Animation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-surface-700">
              <button type="button" onClick={() => navigate('/admin/shows')} className="px-6 py-2 rounded-xl border border-surface-700 bg-surface-800 text-white hover:bg-surface-700 transition-colors text-sm font-semibold">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 disabled:opacity-50 transition-all text-sm">
                {loading ? 'Updating...' : 'Update Show'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShowEdit;
