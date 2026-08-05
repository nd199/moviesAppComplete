import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import FaEdit from 'react-icons/fa/FaEdit';
import FaTrash from 'react-icons/fa/FaTrash';
import FaPlus from 'react-icons/fa/FaPlus';
import FaSearch from 'react-icons/fa/FaSearch';
import {Calendar, Clock, Film, Star} from 'lucide-react';
import toast from 'react-hot-toast';
import {deleteMovie, fetchMovies} from '../../services/adminApi';
import debounce from 'lodash.debounce';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredMovies.slice(start, end);
    }, [currentPage, filteredMovies, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredMovies.length / itemsPerPage);
    }, [filteredMovies.length, itemsPerPage]);

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

    const debouncedSearch = useMemo(
        () => debounce((term, allMovies) => {
            if (term.trim() === '') {
                setFilteredMovies(allMovies);
                return;
            }

            const searchLower = term.toLowerCase();
            const filtered = allMovies.filter(movie =>
                movie.name?.toLowerCase().includes(searchLower) ||
                movie.description?.toLowerCase().includes(searchLower) ||
                movie.genre?.toLowerCase().includes(searchLower) ||
                movie.year?.toString().includes(searchLower) ||
                movie.rating?.toString().includes(searchLower)
            );
            setFilteredMovies(filtered);
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm, movies);
        setCurrentPage(1);
        return () => debouncedSearch.cancel();
    }, [searchTerm, movies, debouncedSearch]);

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


    const stats = useMemo(() => {
        const totalMovies = movies.length;
        const avgRating = movies.length > 0 ?
            (movies.reduce((sum, m) => sum + (m.rating || 0), 0) / movies.length).toFixed(1) : '0.0';
        const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))].length;
        return {totalMovies, avgRating, genres}
    }, [movies]);


    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    {label: 'Total Movies', value: stats.totalMovies, icon: Film, color: 'from-brand-600 to-brand-700'},
                    {
                        label: 'Avg. Rating',
                        value: stats.avgRating,
                        icon: Star,
                        color: 'from-amber-500 to-orange-500',
                        prefix: '★'
                    },
                    {label: 'Genres', value: stats.genres, icon: Calendar, color: 'from-emerald-500 to-teal-500'},
                    {
                        label: 'Filtered',
                        value: filteredMovies.length,
                        icon: Clock,
                        color: 'from-accent-600 to-accent-700'
                    },
                ].map((stat) => (
                    <div key={stat.label} className="bg-surface-900 border border-surface-700 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-surface-500">{stat.label}</p>
                                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stat.prefix || ''}{stat.value}</p>
                            </div>
                            <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 sm:flex-none">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500"/>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-900 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors text-sm w-full sm:w-72"
                    />
                </div>
                <Link to="/admin/movies/new" className="shrink-0">
                    <button
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
                        <FaPlus className="h-3.5 w-3.5"/>
                        Add Movie
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
                                        <div
                                            className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm">Loading movies...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredMovies.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                                            <Film className="h-6 w-6 text-surface-500"/>
                                        </div>
                                        <p className="text-surface-500 text-sm">No movies found</p>
                                        <Link to="/admin/movies/new"
                                              className="text-brand-400 text-sm hover:text-brand-300">Add your first
                                            movie</Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedMovies.map((movie) => (
                                <tr key={movie.id} className="hover:bg-surface-800/50 transition-colors">
                                    <td className="px-4 py-3 text-surface-500 font-mono text-xs">{movie.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {movie.poster && (
                                                <img
                                                    className="w-10 h-10 rounded-lg object-cover border border-surface-700"
                                                    src={movie.poster} alt="Poster"/>
                                            )}
                                            <span className="font-semibold text-white">{movie.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-surface-500 max-w-xs truncate">{movie.description || '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-amber-400 text-sm">★</span>
                                            <span
                                                className="text-white font-medium">{movie.rating != null ? (Math.floor(movie.rating * 100) / 100).toFixed(2) : '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-surface-500">{movie.year || '—'}</td>
                                    <td className="px-4 py-3">
                                        {movie.genre && (
                                            <span
                                                className="px-2 py-1 text-xs bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">
                          {movie.genre}
                        </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-surface-500">{movie.runtime || '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Link to={`/admin/movies/edit/${movie.id}`}>
                                                <button
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                                                    <FaEdit className="h-3.5 w-3.5"/>
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => deleteMovieHandler(movie.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                                            >
                                                <FaTrash className="h-3.5 w-3.5"/>
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

            {/* Cards — Mobile */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center gap-3 text-surface-500">
                            <div
                                className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Loading movies...</span>
                        </div>
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center">
                                <Film className="h-6 w-6 text-surface-500"/>
                            </div>
                            <p className="text-surface-500 text-sm">No movies found</p>
                            <Link to="/admin/movies/new" className="text-brand-400 text-sm hover:text-brand-300">Add
                                your first movie</Link>
                        </div>
                    </div>
                ) : (
                    paginatedMovies.map((movie) => (
                        <div key={movie.id} className="bg-surface-900 border border-surface-700 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    {movie.poster && (
                                        <img
                                            className="w-10 h-10 rounded-lg object-cover border border-surface-700 flex-shrink-0"
                                            src={movie.poster} alt="Poster"/>
                                    )}
                                    <div className="min-w-0">
                                        <div className="font-semibold text-white truncate">{movie.name}</div>
                                        <div className="flex items-center gap-1 text-xs text-surface-500">
                                            <span className="text-amber-400">★</span>
                                            <span>{movie.rating != null ? (Math.floor(movie.rating * 100) / 100).toFixed(2) : '—'}</span>
                                            <span className="mx-1">·</span>
                                            <span>{movie.year || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <Link to={`/admin/movies/edit/${movie.id}`}>
                                        <button
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
                                            <FaEdit className="h-3.5 w-3.5"/>
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => deleteMovieHandler(movie.id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <FaTrash className="h-3.5 w-3.5"/>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {movie.genre && (
                                    <span
                                        className="px-2 py-1 bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-lg">{movie.genre}</span>
                                )}
                                {movie.runtime && (
                                    <span
                                        className="px-2 py-1 bg-surface-800 text-surface-500 rounded-lg">{movie.runtime}m</span>
                                )}
                                {movie.description && (
                                    <p className="text-surface-500 text-xs truncate w-full mt-1">{movie.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-surface-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMovies.length)} of {filteredMovies.length} movies
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg border border-surface-700 bg-surface-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-800 transition-colors text-sm"
                        >
                            Previous
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({length: totalPages}, (_, i) => i + 1)?.map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-brand-600 text-white'
                                            : 'border border-surface-700 bg-surface-900 text-white hover:bg-surface-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg border border-surface-700 bg-surface-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-800 transition-colors text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;