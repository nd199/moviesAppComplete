import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchContentManagers, deleteContentManager as deleteContentManagerApi } from '../../services/adminApi';

const ContentManagerList = () => {
  const [contentManagers, setContentManagers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const defaultContentManagerPicture = [
    "https://picsum.photos/seed/cm1/100/100.jpg",
    "https://picsum.photos/seed/cm2/100/100.jpg",
  ];
  const defaultSelected =
    defaultContentManagerPicture[Math.floor(Math.random() * defaultContentManagerPicture.length)];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">Content Managers</h1>
          <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
            {contentManagers.length} total
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search content managers..."
            className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <Link 
            to="/admin/content-managers/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-500/10 hover:from-green-600 hover:to-teal-700"
          >
            <FaPlus />
            Create Content Manager
          </Link>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-slate-800 text-slate-300 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-4 text-left font-medium">ID</th>
                <th className="px-4 py-4 text-left font-medium">Content Manager</th>
                <th className="px-4 py-4 text-left font-medium">Email</th>
                <th className="px-4 py-4 text-left font-medium">Status</th>
                <th className="px-4 py-4 text-left font-medium">Movies</th>
                <th className="px-4 py-4 text-left font-medium">Shows</th>
                <th className="px-4 py-4 text-left font-medium">Created</th>
                <th className="px-4 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {contentManagers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    No content managers found.
                  </td>
                </tr>
              ) : (
                contentManagers.map((cm) => (
                  <tr key={cm.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-slate-300">{cm.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          src={cm.imageUrl || defaultSelected}
                          alt="Content Manager Avatar"
                        />
                        <div>
                          <div className="font-semibold text-white">{cm.name}</div>
                          <div className="text-xs text-slate-400">Content Manager</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{cm.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        cm.isActive
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-red-900/30 text-red-300'
                      }`}>
                        {cm.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{cm.moviesManaged || 0}</td>
                    <td className="px-4 py-3 text-slate-300">{cm.showsManaged || 0}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {cm.createdAt ? new Date(cm.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/content-managers/edit/${cm.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(cm.id)}
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

export default ContentManagerList;
