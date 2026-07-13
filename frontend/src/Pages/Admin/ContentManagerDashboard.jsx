import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchMovies, fetchShows, deleteMovie, deleteShow } from '../../services/adminApi';

const ContentManagerDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    } else {
      navigate('/admin/cm-login');
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      const [moviesData, showsData] = await Promise.all([fetchMovies(), fetchShows()]);
      setMovies(moviesData);
      setShows(showsData);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(movieId);
        setMovies(movies.filter(m => m.id !== movieId));
        toast.success('Movie deleted successfully');
      } catch (error) {
        toast.error('Failed to delete movie');
      }
    }
  };

  const handleDeleteShow = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await deleteShow(showId);
        setShows(shows.filter(s => s.id !== showId));
        toast.success('Show deleted successfully');
      } catch (error) {
        toast.error('Failed to delete show');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-24 w-12 h-12 bg-white/10 rounded-2xl rotate-12" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Welcome back, {currentUser?.name || 'Content Manager'}</h2>
          <p className="text-white/80 mt-1">Manage your movies and shows from here.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-sm font-medium text-white/80">Total Movies</span>
            <p className="text-3xl font-bold mt-1">{movies.length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-sm font-medium text-white/80">Total Shows</span>
            <p className="text-3xl font-bold mt-1">{shows.length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-sm font-medium text-white/80">Total Content</span>
            <p className="text-3xl font-bold mt-1">{movies.length + shows.length}</p>
          </div>
        </div>
      </div>

      {/* Content Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movies */}
        <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-white">My Movies</h3>
              <p className="text-sm text-white/80 mt-0.5">{movies.length} movies in library</p>
            </div>
            <button onClick={() => navigate('/admin/movies/new')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl backdrop-blur transition-colors">
              + Add Movie
            </button>
          </div>
          <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
            {movies.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">No movies found</p>
            ) : (
              movies.slice(0, 10).map((movie) => (
                <div key={movie.id} className="flex items-center justify-between p-3 bg-gray-200/60 rounded-xl hover:bg-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={movie.poster || 'https://picsum.photos/seed/movie/50/50.jpg'} alt={movie.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{movie.name}</p>
                      <p className="text-xs text-gray-600">{movie.genre} · {movie.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
                      className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDeleteMovie(movie.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shows */}
        <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-white">My Shows</h3>
              <p className="text-sm text-white/80 mt-0.5">{shows.length} shows in library</p>
            </div>
            <button onClick={() => navigate('/admin/shows/new')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl backdrop-blur transition-colors">
              + Add Show
            </button>
          </div>
          <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
            {shows.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">No shows found</p>
            ) : (
              shows.slice(0, 10).map((show) => (
                <div key={show.show_id} className="flex items-center justify-between p-3 bg-gray-200/60 rounded-xl hover:bg-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={show.poster || 'https://picsum.photos/seed/show/50/50.jpg'} alt={show.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{show.name}</p>
                      <p className="text-xs text-gray-600">{show.genre} · {show.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate(`/admin/shows/edit/${show.show_id}`)}
                      className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDeleteShow(show.show_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-100 rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'All Movies', icon: '🎬', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', action: () => navigate('/admin/movies') },
            { label: 'All Shows', icon: '📺', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', action: () => navigate('/admin/shows') },
            { label: 'New Movie', icon: '➕', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100', action: () => navigate('/admin/movies/new') },
            { label: 'New Show', icon: '➕', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', action: () => navigate('/admin/shows/new') },
          ].map((item) => (
            <button key={item.label} onClick={item.action}
              className={`p-4 rounded-xl text-center transition-colors ${item.color}`}>
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-semibold mt-2">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentManagerDashboard;
