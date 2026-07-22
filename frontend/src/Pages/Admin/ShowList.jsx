import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { HiTv, HiStar } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchShows, deleteShow } from '../../services/adminApi';

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShowList = async () => {
      setLoading(true);
      try {
        const showsData = await fetchShows();
        setShows(showsData);
        setFilteredShows(showsData);
      } catch (error) {
        console.error("Error fetching shows:", error);
        toast.error('Failed to fetch shows');
      } finally {
        setLoading(false);
      }
    };
    fetchShowList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredShows(shows);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = shows.filter(show =>
        show.name?.toLowerCase().includes(searchLower) ||
        show.description?.toLowerCase().includes(searchLower) ||
        show.genre?.toLowerCase().includes(searchLower) ||
        show.year?.toString().includes(searchLower) ||
        show.rating?.toString().includes(searchLower) ||
        show.category?.toLowerCase().includes(searchLower)
      );
      setFilteredShows(filtered);
    }
  }, [searchTerm, shows]);

  const deleteShowHandler = async (showId) => {
    if (!showId) return;
    try {
      await deleteShow(showId);
      const updatedShows = shows.filter(show => show.show_id !== showId);
      setShows(updatedShows);
      setFilteredShows(updatedShows);
      toast.success('Show deleted successfully');
    } catch (err) {
      console.error("Error deleting show:", err);
      toast.error('Failed to delete show');
    }
  };

  const totalShows = shows.length;
  const categories = [...new Set(shows.map(s => s.category).filter(Boolean))].length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Shows', value: totalShows, icon: HiTv, color: 'from-brand-600 to-brand-700' },
          { label: 'Categories', value: categories, icon: HiStar, color: 'from-emerald-500 to-teal-500' },
          { label: 'Avg. Rating', value: shows.length > 0 ? (shows.reduce((s, sh) => s + (sh.rating || 0), 0) / shows.length).toFixed(1) : '0.0', icon: HiStar, color: 'from-amber-500 to-orange-500', prefix: '★' },
          { label: 'Showing', value: filteredShows.length, icon: HiTv, color: 'from-accent-600 to-accent-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-900 border border-surface-700 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-surface-500">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stat.prefix || ''}{stat.value}</p>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:flex-none">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-900 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors text-sm w-full sm:w-72"
          />
        </div>
        <Link to="/admin/shows/new" className="shrink-0">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <FaPlus className="h-3.5 w-3.5" />
            Add Show
          </button>
        </Link>
      </div>

      {/* Table — Desktop */}
      <div className="bg-surface-900 border border-surface-700 rounded-2xl overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-800 border-b border-surface-700">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Genre</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Runtime</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-surface-500">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading shows...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredShows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                        <HiTv className="h-6 w-6 text-surface-500" />
                      </div>
                      <p className="text-surface-500 text-sm">No shows found</p>
                      <Link to="/admin/shows/new" className="text-brand-400 text-sm hover:text-brand-300">Add your first show</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShows.map((show) => (
                  <tr key={show.show_id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="px-4 py-3 text-surface-500 font-mono text-xs">{show.show_id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {show.poster && (
                          <img className="w-10 h-10 rounded-lg object-cover border border-surface-700" src={show.poster} alt="Poster" />
                        )}
                        <span className="font-semibold text-white">{show.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500 max-w-xs truncate">{show.description || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-white font-medium">{show.rating || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500">{show.year || '—'}</td>
                    <td className="px-4 py-3">
                      {show.genre && (
                        <span className="px-2 py-1 text-xs bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">
                          {show.genre}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-500">{show.runtime || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-lg">
                        {show.category || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">
                        {show.type || 'shows'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/shows/edit/${show.show_id}`}>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteShowHandler(show.show_id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {show.createdAt ? new Date(show.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {show.updatedAt ? new Date(show.updatedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 text-surface-500">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading shows...</span>
            </div>
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                <HiTv className="h-6 w-6 text-surface-500" />
              </div>
              <p className="text-surface-500 text-sm">No shows found</p>
              <Link to="/admin/shows/new" className="text-brand-400 text-sm hover:text-brand-300">Add your first show</Link>
            </div>
          </div>
        ) : (
          filteredShows.map((show) => (
            <div key={show.show_id} className="bg-surface-900 border border-surface-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {show.poster && (
                    <img className="w-10 h-10 rounded-lg object-cover border border-surface-700 flex-shrink-0" src={show.poster} alt="Poster" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{show.name}</div>
                    <div className="flex items-center gap-1 text-xs text-surface-500">
                      <span className="text-amber-400">★</span>
                      <span>{show.rating || '—'}</span>
                      <span className="mx-1">·</span>
                      <span>{show.year || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link to={`/admin/shows/edit/${show.show_id}`}>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                      <FaEdit className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteShowHandler(show.show_id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {show.genre && (
                  <span className="px-2 py-1 bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">{show.genre}</span>
                )}
                {show.category && (
                  <span className="px-2 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-lg">{show.category}</span>
                )}
                {show.runtime && (
                  <span className="px-2 py-1 bg-surface-800 text-surface-500 rounded-lg">{show.runtime}m</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowList;
