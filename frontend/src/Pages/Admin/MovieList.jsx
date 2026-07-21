import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { HiFilm, HiStar, HiCalendar, HiClock } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchMovies, deleteMovie } from '../../services/adminApi';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMovieList = async () => {
      setLoading(true);
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = movies.filter(movie =>
        movie.name?.toLowerCase().includes(searchLower) ||
        movie.description?.toLowerCase().includes(searchLower) ||
        movie.genre?.toLowerCase().includes(searchLower) ||
        movie.year?.toString().includes(searchLower) ||
        movie.rating?.toString().includes(searchLower)
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  const deleteMovieHandler = async (movieId) => {
    if (!movieId) return;
    try {
      await deleteMovie(movieId);
      const updatedMovies = movies.filter(movie => movie.id !== movieId);
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
      toast.success('Movie deleted successfully');
    } catch (err) {
      console.error("Error deleting movie:", err);
      toast.error('Failed to delete movie');
    }
  };

  const totalMovies = movies.length;
  const avgRating = movies.length > 0 ? (movies.reduce((sum, m) => sum + (m.rating || 0), 0) / movies.length).toFixed(1) : '0.0';
  const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))].length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Movies', value: totalMovies, icon: HiFilm, color: 'from-brand-600 to-brand-700' },
          { label: 'Avg. Rating', value: avgRating, icon: HiStar, color: 'from-amber-500 to-orange-500', prefix: '★' },
          { label: 'Genres', value: genres, icon: HiCalendar, color: 'from-emerald-500 to-teal-500' },
          { label: 'Filtered', value: filteredMovies.length, icon: HiClock, color: 'from-accent-600 to-accent-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-900 border border-surface-700 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.prefix || ''}{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-900 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors text-sm w-72"
            />
          </div>
        </div>
        <Link to="/admin/movies/new">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
            <FaPlus className="h-3.5 w-3.5" />
            Add Movie
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-surface-900 border border-surface-700 rounded-2xl overflow-hidden">
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
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-surface-500">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading movies...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                        <HiFilm className="h-6 w-6 text-surface-500" />
                      </div>
                      <p className="text-surface-500 text-sm">No movies found</p>
                      <Link to="/admin/movies/new" className="text-brand-400 text-sm hover:text-brand-300">Add your first movie</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="px-4 py-3 text-surface-500 font-mono text-xs">{movie.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {movie.poster && (
                          <img className="w-10 h-10 rounded-lg object-cover border border-surface-700" src={movie.poster} alt="Poster" />
                        )}
                        <span className="font-semibold text-white">{movie.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500 max-w-xs truncate">{movie.description || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-white font-medium">{movie.rating || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500">{movie.year || '—'}</td>
                    <td className="px-4 py-3">
                      {movie.genre && (
                        <span className="px-2 py-1 text-xs bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">
                          {movie.genre}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-500">{movie.runtime || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/movies/edit/${movie.id}`}>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteMovieHandler(movie.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {movie.updatedAt ? new Date(movie.updatedAt).toLocaleDateString() : '—'}
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

export default MovieList;
