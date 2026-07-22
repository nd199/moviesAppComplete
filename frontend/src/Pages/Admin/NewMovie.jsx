import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createMovie } from '../../services/adminApi';

const NewMovie = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({});
  const [file, setFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const allInputsFilled = Object.values(input).every((value) => value);
    setIsButtonDisabled(!(allInputsFilled && file));
  }, [input, file]);

  const changeHandler = (e) => {
    const { name, value, type } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const clickHandler = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('poster', file);
      formData.append('title', input.name || '');
      formData.append('description', input.description || '');
      formData.append('duration', input.duration || '');
      formData.append('cost', input.cost || 0);
      await createMovie(formData);
      toast.success('Movie created successfully!');
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error creating movie:', error);
      toast.error('Failed to create movie');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white">Add New Title</h1>
          <p className="text-sm text-surface-500 mt-0.5">Create a new movie/show in your OTT catalog</p>
        </div>
        <button onClick={() => navigate('/admin/movies')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors shrink-0">
          <HiArrowLeft className="h-4 w-4" />
          Back to Movies
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Details</div>
          <div className="mt-1 text-sm text-surface-500">Fill the metadata. Poster is required.</div>

          <form className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-500">Poster</label>
              <input type="file" id="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
                className="mt-2 block w-full rounded-xl border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-500" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-surface-500">Name</label>
                <input name="name" type="text" placeholder="Movie / Show Name" onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Type</label>
                <select name="type" onChange={changeHandler} defaultValue=""
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors">
                  <option value="" disabled>Select Type</option>
                  <option value="movies">Movies</option>
                  <option value="shows">Tv-Show</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Cost</label>
                <input type="number" name="cost" placeholder="Movie / Show Cost" onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Rating</label>
                <input type="number" name="rating" placeholder="Movie / Show Rating" onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-500">Genre</label>
              <input type="text" placeholder="',' i.e: Mystery, Horror" name="genre" onChange={changeHandler}
                className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              {!!input.genre && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {String(input.genre).split(',').map((g) => g.trim()).filter(Boolean).slice(0, 8).map((g) => (
                    <span key={g} className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-1 text-xs font-semibold text-white">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-500">Description</label>
              <textarea placeholder="Movie/Show-Description" name="description" onChange={changeHandler} rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-surface-500">Age Rating</label>
                <input type="text" placeholder="UA" name="ageRating" onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Release Year</label>
                <input type="text" placeholder="Released Year" name="year" onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Runtime</label>
                <input type="text" placeholder="Runtime in minutes" name="runtime" onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button onClick={clickHandler} disabled={isButtonDisabled}
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Poster Preview</div>
          <div className="mt-1 text-sm text-surface-500">Looks good on the big screen.</div>
          <div className="mt-6">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-surface-700 bg-surface-800">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Poster preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-surface-500">
                  Upload a poster to preview
                </div>
              )}
            </div>
            <div className="mt-4 rounded-xl border border-surface-700 bg-surface-800 p-4">
              <div className="text-sm font-semibold text-white">{input.name || 'Untitled'}</div>
              <div className="mt-1 text-xs text-surface-500">{input.type || 'movie/show'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMovie;
