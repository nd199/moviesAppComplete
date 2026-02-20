import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchMovies, deleteMovie } from '../services/adminApi';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovieList = async () => {
      setLoading(true);
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieList();
  }, []);

  const deleteMovieHandler = async (movieId) => {
    if (!movieId) {
      console.error("Missing movieId");
      return;
    }
    try {
      await deleteMovie(movieId);
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
      toast.success('Movie deleted successfully');
    } catch (err) {
      console.error("Error deleting movie:", err);
      toast.error('Failed to delete movie');
    }
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] overflow-hidden relative flex-col justify-center">
      <div className="mx-5 my-5 w-full flex justify-end">
        <Link to="/movies/new">
          <button 
            className="w-20 border-none p-1 rounded-lg bg-green-600 cursor-pointer text-white text-xl mr-5"
          >
            Create
          </button>
        </Link>
      </div>
      <div className="w-full overflow-scroll">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Duration</th>
              <th className="border p-2 text-left">Action</th>
              <th className="border p-2 text-left">Created On</th>
              <th className="border p-2 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <td className="border p-2">{movie.id}</td>
                <td className="border p-2">{movie.title}</td>
                <td className="border p-2">{movie.description || 'N/A'}</td>
                <td className="border p-2">{movie.duration || 'N/A'}</td>
                <td className="border p-2">
                  <div className="mx-2.5 p-0 flex items-center gap-1">
                    <Link to={`/movies/edit/${movie.id}`}>
                      <FaEdit 
                        className="text-3xl m-0 rounded-lg bg-green-600 p-0.5 text-white cursor-pointer" 
                      />
                    </Link>
                    <FaTrash
                      className="bg-red-600 text-3xl rounded-lg p-0.5 text-white cursor-pointer mb-5"
                      onClick={() => deleteMovieHandler(movie.id)}
                    />
                  </div>
                </td>
                <td className="border p-2">{new Date(movie.createdAt).toLocaleDateString()}</td>
                <td className="border p-2">{new Date(movie.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieList;
