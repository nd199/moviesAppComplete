import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createShow } from '../services/adminApi';

const NewShow = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    description: '',
    poster: '',
    ageRating: '',
    year: '',
    runtime: '',
    genre: '',
    category: 'General',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' || name === 'year' ?
        (value === '' ? '' : Number(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.rating || !formData.description ||
          !formData.poster || !formData.ageRating || !formData.year ||
          !formData.runtime || !formData.genre) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await createShow(formData);
      toast.success('Show created successfully');
      navigate('/shows');
    } catch (error) {
      toast.error('Failed to create show');
      console.error('Error creating show:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-100 dark:text-white">Create New Show</h1>
        <p className="text-sm text-slate-400 dark:text-slate-300">Add a new TV show or series to your catalog</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-white/10 dark:border-slate-700/50 bg-white/5 dark:bg-slate-800/50 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Show Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Breaking Bad"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Rating *
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="8.5"
                    step="0.1"
                    min="0"
                    max="10"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2008"
                    min="1900"
                    max="2030"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter show description..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Poster URL *
                  </label>
                  <input
                    type="url"
                    name="poster"
                    value={formData.poster}
                    onChange={handleChange}
                    placeholder="https://example.com/poster.jpg"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Age Rating *
                  </label>
                  <select
                    name="ageRating"
                    value={formData.ageRating}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  >
                    <option value="">Select age rating</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="TV-Y">TV-Y</option>
                    <option value="TV-Y7">TV-Y7</option>
                    <option value="TV-G">TV-G</option>
                    <option value="TV-PG">TV-PG</option>
                    <option value="TV-14">TV-14</option>
                    <option value="TV-MA">TV-MA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Runtime *
                  </label>
                  <input
                    type="text"
                    name="runtime"
                    value={formData.runtime}
                    onChange={handleChange}
                    placeholder="e.g., 47 min or 2h 30min"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Genre *
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="e.g., Crime, Drama, Thriller"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-100 dark:text-white mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white focus:outline-none focus:border-white/20 dark:focus:border-slate-500 transition-colors"
                    required
                  >
                    <option value="General">General</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/10 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => navigate('/shows')}
                  className="px-6 py-2 rounded-lg border border-white/10 dark:border-slate-600 bg-white/5 dark:bg-slate-700/50 text-slate-100 dark:text-white hover:bg-white/10 dark:hover:bg-slate-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewShow;
