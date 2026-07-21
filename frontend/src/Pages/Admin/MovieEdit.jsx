import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { fetchMovies, updateMovie } from '../../services/adminApi';

const MovieEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const movieId = Number(id);

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
          navigate('/admin/movies');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast.error('Failed to fetch movie');
      } finally {
        setLoading(false);
      }
    };
    if (movieId) fetchMovieData();
  }, [movieId, navigate]);

  const movieUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (file) formData.append('poster', file);
      formData.append('title', name);
      formData.append('description', description);
      formData.append('duration', runtime);
      formData.append('cost', cost);
      await updateMovie(movieId, formData);
      toast.success('Movie updated successfully!');
      navigate('/admin/movies');
    } catch (err) {
      console.error("Error updating movie:", err);
      toast.error('Failed to update movie');
    }
  };

  const fileUploadHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="flex items-center gap-3 text-surface-500">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading movie...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Edit Title</h1>
          <p className="text-sm text-surface-500 mt-0.5">Update metadata and poster artwork</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/movies/new">
            <button className="rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
              Add New
            </button>
          </Link>
          <button
            onClick={() => navigate('/admin/movies')}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors"
          >
            <HiArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Metadata</div>
          <div className="mt-1 text-sm text-surface-500">Keep the catalog clean and searchable.</div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-surface-500">ID</label>
              <input type="text" disabled value={movie?.id || ''}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-surface-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500">Type</label>
              <input type="text" disabled value={movie?.type || 'movies'}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-surface-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500">Cost</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500">Genre</label>
              <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500">Runtime</label>
              <input type="text" value={runtime} onChange={(e) => setRuntime(e.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
            </div>
          </div>

          <form onSubmit={movieUpdateHandler} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-500">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
            </div>
            <div className="flex items-center justify-end">
              <button type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Poster */}
        <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Poster</div>
          <div className="mt-1 text-sm text-surface-500">Artwork shown on detail and listing pages.</div>
          <div className="mt-6">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-surface-700 bg-surface-800">
              <img src={imageUrl || "/REGBack.jpg"} alt="Poster" className="h-full w-full object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-surface-700 bg-surface-800 p-4">
              <div>
                <div className="text-sm font-semibold text-white">{name || movie?.title || 'Untitled'}</div>
                <div className="mt-1 text-xs text-surface-500">Upload a new poster to replace</div>
              </div>
              <label htmlFor="file" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-surface-700 bg-surface-700 px-3 py-2 text-xs font-semibold text-white hover:bg-surface-600 transition-colors">
                <FaUpload />
                Upload
              </label>
              <input type="file" id="file" accept="image/*" style={{ display: "none" }} onChange={fileUploadHandler} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEdit;
