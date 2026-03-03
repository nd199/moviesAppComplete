import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaFilm, FaTv, FaPlus, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { contentManagerApi } from '../services/contentManagerApi';
import { logout } from '../store/authSlice'; // Import global logout action

const ContentManagerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch
  const { admin: contentManager } = useSelector((state) => state.auth); // Get user from Redux
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    if (contentManager) {
      fetchDashboardData();
    } else {
      // If no user in state, redirect to login
      navigate('/contentManagerLogin');
    }
  }, [contentManager]);

  const fetchDashboardData = async () => {
    try {
      // Get analytics
      const analyticsData = await contentManagerApi.getContentManagerAnalytics(contentManager.id);
      setAnalytics(analyticsData);

      // Get movies and shows
      const [moviesData, showsData] = await Promise.all([
        contentManagerApi.getMoviesByContentManager(contentManager.id),
        contentManagerApi.getShowsByContentManager(contentManager.id)
      ]);
      
      setMovies(moviesData);
      setShows(showsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/contentManagerLogin');
    toast.success('Logged out successfully');
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await contentManagerApi.deleteMovie(contentManager.id, movieId);
        setMovies(movies.filter(m => m.id !== movieId));
        toast.success('Movie deleted successfully');
        fetchDashboardData(); // Refresh analytics
      } catch (error) {
        toast.error('Failed to delete movie');
      }
    }
  };

  const handleDeleteShow = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await contentManagerApi.deleteShow(contentManager.id, showId);
        setShows(shows.filter(s => s.id !== showId));
        toast.success('Show deleted successfully');
        fetchDashboardData(); // Refresh analytics
      } catch (error) {
        toast.error('Failed to delete show');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Manager Dashboard</h1>
          <p className="text-slate-300 mt-1">Welcome back, {contentManager?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Movies</p>
                <p className="text-2xl font-bold text-white">{analytics.movieCount}</p>
              </div>
              <FaFilm className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Shows</p>
                <p className="text-2xl font-bold text-white">{analytics.showCount}</p>
              </div>
              <FaTv className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Content</p>
                <p className="text-2xl font-bold text-white">{analytics.totalContent}</p>
              </div>
              <div className="text-purple-500 text-2xl">📊</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Movies Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">My Movies</h2>
            <button
              onClick={() => navigate('/movies/new')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <FaPlus />
              Add Movie
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {movies.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No movies found</p>
            ) : (
              movies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.poster || 'https://picsum.photos/seed/movie/50/50.jpg'}
                      alt={movie.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">{movie.name}</p>
                      <p className="text-slate-400 text-sm">{movie.genre} • {movie.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/movies/edit/${movie.id}`)}
                      className="p-2 text-blue-400 hover:bg-slate-600 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="p-2 text-red-400 hover:bg-slate-600 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shows Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">My Shows</h2>
            <button
              onClick={() => navigate('/shows/new')}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              <FaPlus />
              Add Show
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {shows.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No shows found</p>
            ) : (
              shows.map((show) => (
                <div key={show.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={show.poster || 'https://picsum.photos/seed/show/50/50.jpg'}
                      alt={show.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">{show.name}</p>
                      <p className="text-slate-400 text-sm">{show.genre} • {show.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/shows/edit/${show.id}`)}
                      className="p-2 text-green-400 hover:bg-slate-600 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteShow(show.id)}
                      className="p-2 text-red-400 hover:bg-slate-600 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/movies')}
            className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            <FaFilm className="text-blue-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">All Movies</p>
          </button>
          <button
            onClick={() => navigate('/shows')}
            className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            <FaTv className="text-green-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">All Shows</p>
          </button>
          <button
            onClick={() => navigate('/movies/new')}
            className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            <FaPlus className="text-purple-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">New Movie</p>
          </button>
          <button
            onClick={() => navigate('/shows/new')}
            className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
          >
            <FaPlus className="text-teal-500 text-2xl mx-auto mb-2" />
            <p className="text-white text-sm">New Show</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentManagerDashboard;