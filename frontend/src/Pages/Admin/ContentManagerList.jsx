import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { HiUser, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchContentManagers, deleteContentManager as deleteContentManagerApi } from '../../services/adminApi';

const avatarGradients = [
  'from-brand-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
];

const ContentManagerList = () => {
  const [contentManagers, setContentManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContentManagers();
  }, []);

  const loadContentManagers = async () => {
    setLoading(true);
    try {
      const data = await fetchContentManagers();
      setContentManagers(data);
    } catch (error) {
      console.error('Failed to fetch content managers:', error);
      toast.error('Failed to fetch content managers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content manager?')) {
      try {
        await deleteContentManagerApi(id);
        setContentManagers(contentManagers.filter(cm => cm.id !== id));
        toast.success('Content manager deleted successfully');
      } catch (error) {
        console.error('Failed to delete content manager:', error);
        toast.error('Failed to delete content manager');
      }
    }
  };

  const filtered = contentManagers.filter(cm =>
    cm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cm.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCMs = contentManagers.length;
  const activeCMs = contentManagers.filter(cm => cm.isActive).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total CMs', value: totalCMs, icon: HiUser, color: 'from-brand-600 to-brand-700' },
          { label: 'Active', value: activeCMs, icon: HiCheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: 'Inactive', value: totalCMs - activeCMs, icon: HiXCircle, color: 'from-red-500 to-rose-500' },
          { label: 'Showing', value: filtered.length, icon: HiUser, color: 'from-accent-600 to-accent-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-900 border border-surface-700 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-surface-500">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stat.value}</p>
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
            placeholder="Search content managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-900 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors text-sm w-full sm:w-72"
          />
        </div>
        <Link to="/admin/content-managers/new" className="shrink-0">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <FaPlus className="h-3.5 w-3.5" />
            Create Content Manager
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
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Content Manager</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Movies</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Shows</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-surface-500">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading content managers...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                        <HiUser className="h-6 w-6 text-surface-500" />
                      </div>
                      <p className="text-surface-500 text-sm">No content managers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((cm, idx) => (
                  <tr key={cm.id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="px-4 py-3 text-surface-500 font-mono text-xs">{cm.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center shadow-sm`}>
                          <span className="text-white text-xs font-bold">{cm.name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{cm.name}</div>
                          <div className="text-xs text-surface-500">Content Manager</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500">{cm.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                        cm.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/15 text-red-400 border border-red-500/20'
                      }`}>
                        {cm.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{cm.moviesManaged || 0}</td>
                    <td className="px-4 py-3 text-white font-medium">{cm.showsManaged || 0}</td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {cm.createdAt ? new Date(cm.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/content-managers/edit/${cm.id}`}>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(cm.id)}
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

      {/* Cards — Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 text-surface-500">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading content managers...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                <HiUser className="h-6 w-6 text-surface-500" />
              </div>
              <p className="text-surface-500 text-sm">No content managers found</p>
            </div>
          </div>
        ) : (
          filtered.map((cm, idx) => (
            <div key={cm.id} className="bg-surface-900 border border-surface-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 bg-gradient-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{cm.name?.charAt(0) || '?'}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{cm.name}</div>
                    <div className="text-xs text-surface-500 truncate">{cm.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link to={`/admin/content-managers/edit/${cm.id}`}>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                      <FaEdit className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(cm.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-1 rounded-full font-semibold ${
                  cm.isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  {cm.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-1 bg-surface-800 text-surface-500 rounded-lg">Movies: {cm.moviesManaged || 0}</span>
                <span className="px-2 py-1 bg-surface-800 text-surface-500 rounded-lg">Shows: {cm.showsManaged || 0}</span>
                {cm.createdAt && (
                  <span className="px-2 py-1 bg-surface-800 text-surface-500 rounded-lg">Created: {new Date(cm.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentManagerList;
