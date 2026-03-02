import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchShows, deleteShow } from '../services/adminApi';
import useSimpleScroll from '../hooks/useSimpleScroll';

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scrolled = useSimpleScroll();

  useEffect(() => {
    const fetchShowList = async () => {
      setLoading(true);
      try {
        const showsData = await fetchShows();
        console.log('Raw show data from API:', showsData);
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

  // Search functionality
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
    if (!showId) {
      console.error("Missing showId");
      return;
    }
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

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <Link to="/shows/new">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-blue-500/10"
            >
              Add Show
            </button>
          </Link>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className={`${scrolled ? 'bg-slate-700' : 'bg-slate-800'} text-slate-300 sticky top-0 z-10 backdrop-blur-sm transition-all duration-200`}>
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Rating</th>
                <th className="px-4 py-3 text-left font-medium">Year</th>
                <th className="px-4 py-3 text-left font-medium">Genre</th>
                <th className="px-4 py-3 text-left font-medium">Runtime</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredShows.map((show) => (
                <tr key={show.show_id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-slate-300">{show.show_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {show.poster && (
                        <img
                          className="w-10 h-10 rounded object-cover mr-3"
                          src={show.poster}
                          alt="Show Poster"
                        />
                      )}
                      <div className="font-semibold text-white">{show.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{show.description || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{show.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{show.year || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{show.genre || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{show.runtime || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded">
                      {show.category || 'General'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="px-2 py-1 text-xs bg-purple-900/30 text-purple-300 rounded">
                      {show.type || 'shows'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/shows/edit/${show.show_id}`}>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteShowHandler(show.show_id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-600 bg-red-900/20 text-red-300 hover:bg-red-900/30 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{show.createdAt ? new Date(show.createdAt).toLocaleDateString() + ' ' + new Date(show.createdAt).toLocaleTimeString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{show.updatedAt ? new Date(show.updatedAt).toLocaleDateString() + ' ' + new Date(show.updatedAt).toLocaleTimeString() : 'N/A'}</td>
                </tr>
              ))}

              {!loading && filteredShows.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-slate-400">
                    No shows found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowList;
