import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createMovie } from '../services/adminApi';

const NewMovie = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({});
  const [file, setFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const allInputsFilled = Object.values(input).every((value) => value);
    const fileSelected = file !== null;
    if (allInputsFilled && fileSelected) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
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
    
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('poster', file);
      formData.append('title', input.name || '');
      formData.append('description', input.description || '');
      formData.append('duration', input.duration || '');
      formData.append('cost', input.cost || 0);

      await createMovie(formData);
      toast.success('Movie created successfully!');
      navigate('/movies');
    } catch (error) {
      console.error('Error creating movie:', error);
      toast.error('Failed to create movie');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Add New Title</h1>
          <p className="text-sm text-slate-400">Create a new movie/show in your OTT catalog</p>
        </div>
        <button
          onClick={() => navigate('/movies')}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
          type="button"
        >
          Back to Movies
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Details</div>
          <div className="mt-1 text-sm text-slate-400">Fill the metadata. Poster is required.</div>

          <form className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300">Poster</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-2 block w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-100 hover:file:bg-white/15"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Movie / Show Name"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Type</label>
                <select
                  name="type"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="movies">Movies</option>
                  <option value="shows">Tv-Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Cost</label>
                <input
                  type="number"
                  name="cost"
                  placeholder="Movie / Show Cost"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Rating</label>
                <input
                  type="number"
                  name="rating"
                  placeholder="Movie / Show Rating"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Genre</label>
              <input
                type="text"
                placeholder="',' i.e: Mystery, Horror"
                name="genre"
                onChange={changeHandler}
                className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              {!!input.genre && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {String(input.genre)
                    .split(',')
                    .map((g) => g.trim())
                    .filter(Boolean)
                    .slice(0, 8)
                    .map((g) => (
                      <span
                        key={g}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
                      >
                        {g}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea
                placeholder="Movie/Show-Description"
                name="description"
                onChange={changeHandler}
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-300">Age Rating</label>
                <input
                  type="text"
                  placeholder="UA"
                  name="ageRating"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Release Year</label>
                <input
                  type="text"
                  placeholder="Released Year"
                  name="year"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Runtime</label>
                <input
                  type="text"
                  placeholder="Runtime in minutes"
                  name="runtime"
                  onChange={changeHandler}
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={clickHandler}
                className={`inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500 ${
                  isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isButtonDisabled}
              >
                Create
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Poster Preview</div>
          <div className="mt-1 text-sm text-slate-400">Looks good on the big screen.</div>

          <div className="mt-6">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-black/30">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Poster preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                  Upload a poster to preview
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold text-slate-200">{input.name || 'Untitled'}</div>
              <div className="mt-1 text-xs text-slate-400">{input.type || 'movie/show'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMovie;
