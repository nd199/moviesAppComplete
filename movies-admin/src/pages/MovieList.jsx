import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchMovies, deleteMovie } from '../services/adminApi';
import useSimpleScroll from '../hooks/useSimpleScroll';
import MovieAnalyticsChart from '../components/MovieAnalyticsChart';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const scrolled = useSimpleScroll();

  useEffect(() => {
    const fetchMovieList = async () => {
      setLoading(true);
      try {
        const moviesData = await fetchMovies();
        console.log('Raw movie data from API:', moviesData);
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

  // Search functionality
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
    if (!movieId) {
      console.error("Missing movieId");
      return;
    }
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

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Movies</h1>
          <p className="text-sm text-slate-400">Manage movies and shows in your catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/20 transition-colors"
          />
          <Link to="/movies/new">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500"
            >
              Add Movie
            </button>
          </Link>
        </div>
      </div>

      {/* Movie Analytics Section */}
      <div className="mb-8">
        <MovieAnalyticsChart />
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="h-full overflow-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className={`${scrolled ? 'bg-slate-800/90' : 'bg-white/5'} text-slate-300 sticky top-0 z-10 backdrop-blur-sm transition-all duration-200`}>
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Rating</th>
                <th className="px-4 py-3 text-left font-medium">Year</th>
                <th className="px-4 py-3 text-left font-medium">Genre</th>
                <th className="px-4 py-3 text-left font-medium">Runtime</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-slate-300">{movie.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {movie.poster && (
                        <img
                          className="w-10 h-10 rounded object-cover mr-3"
                          src={movie.poster}
                          alt="Movie Poster"
                        />
                      )}
                      <div className="font-semibold text-slate-100">{movie.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{movie.description || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{movie.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{movie.year || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{movie.genre || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{movie.runtime || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/movies/edit/${movie.id}`}>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteMovieHandler(movie.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() + ' ' + new Date(movie.createdAt).toLocaleTimeString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{movie.updatedAt ? new Date(movie.updatedAt).toLocaleDateString() + ' ' + new Date(movie.updatedAt).toLocaleTimeString() : 'N/A'}</td>
                </tr>
              ))}

              {!loading && filteredMovies.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-slate-400">
                    No movies found.
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

export default MovieList;
