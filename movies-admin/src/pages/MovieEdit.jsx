import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Chart from '../components/Chart';
import { FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchMovies, updateMovie } from '../services/adminApi';

const MovieEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = Number(location.pathname.split("/")[2]);
  
  const [movie, setMovie] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [genre, setGenre] = useState("");
  const [runtime, setRuntime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movies = await fetchMovies();
        const currentMovie = movies.find(m => m.id === movieId);
        
        if (currentMovie) {
          setMovie(currentMovie);
          setName(currentMovie.title || '');
          setDescription(currentMovie.description || '');
          setCost(currentMovie.cost || '');
          setGenre(currentMovie.genre || '');
          setRuntime(currentMovie.duration || '');
          setImageUrl(currentMovie.poster || '');
        } else {
          toast.error('Movie not found');
          navigate('/movies');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast.error('Failed to fetch movie');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId, navigate]);

  const movieUpdateHandler = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      if (file) {
        formData.append('poster', file);
      }
      formData.append('title', name);
      formData.append('description', description);
      formData.append('duration', runtime);
      formData.append('cost', cost);

      await updateMovie(movieId, formData);
      toast.success('Movie updated successfully!');
      navigate('/movies');
    } catch (err) {
      console.error("Error updating movie:", err);
      toast.error('Failed to update movie');
    }
  };

  const fileUploadHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(fileURL);
      setImageUrl(fileURL);
    }
  };

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="p-5 bg-gray-50 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-gray-800" style={{ fontSize: '2rem', fontWeight: '700' }}>Edit Movie</h1>
        <Link to="/movies/new">
          <button 
            className="w-20 border-none p-1 rounded-lg bg-green-600 cursor-pointer text-white text-xl mr-5"
          >
            Create
          </button>
        </Link>
      </div>
      <div className="flex">
        <div className="flex-1">
          <Chart data={[]} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <img
              src={imageUrl || "/images/REGBack.jpg"}
              alt=""
              className="w-24 h-24 rounded-lg object-cover mr-4"
            />
            <span className="text-xl font-semibold">{name}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={movie?.id || ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                name="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Runtime</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="runtime"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={movie?.type || 'movies'}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="text-lg font-semibold mb-4">Update Movie</div>
        <form onSubmit={movieUpdateHandler} className="flex">
          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded h-32"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-col items-center justify-center ml-8">
            <div className="flex flex-col items-center">
              <img
                src={imageUrl || "/images/REGBack.jpg"}
                alt=""
                className="w-32 h-32 rounded-lg object-cover mb-4"
              />
              <label htmlFor="file" className="cursor-pointer">
                <FaUpload className="text-2xl" />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={fileUploadHandler}
              />
            </div>
            <button 
              className="w-32 h-10 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors mt-4"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieEdit;
