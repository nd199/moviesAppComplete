import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Chart from '../components/Chart';
import { FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchMovies, updateMovie } from '../services/adminApi';

const MovieEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = Number(location.pathname.split("/")[3]);
  
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
      setFile(selectedFile);
      setImageUrl(fileURL);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-lg text-slate-300">Loading movie...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Edit Title</h1>
          <p className="text-sm text-slate-400">Update metadata and poster artwork</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/movies/new">
            <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
              Add New
            </button>
          </Link>
          <button
            onClick={() => navigate('/movies')}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            type="button"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Metadata</div>
          <div className="mt-1 text-sm text-slate-400">Keep the catalog clean and searchable.</div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300">ID</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-400"
                value={movie?.id || ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Type</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-400"
                value={movie?.type || 'movies'}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Cost</label>
              <input
                type="number"
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                name="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Genre</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Runtime</label>
              <input
                type="text"
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                name="runtime"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={movieUpdateHandler} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Poster</div>
          <div className="mt-1 text-sm text-slate-400">Artwork shown on detail and listing pages.</div>

          <div className="mt-6">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <img
                src={imageUrl || "/REGBack.jpg"}
                alt="Poster"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
              <div>
                <div className="text-sm font-semibold text-slate-200">{name || movie?.title || 'Untitled'}</div>
                <div className="mt-1 text-xs text-slate-400">Upload a new poster to replace the current one</div>
              </div>
              <label htmlFor="file" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
                <FaUpload />
                Upload
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={fileUploadHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEdit;
