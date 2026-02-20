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
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div 
        className="m-2.5 p-8 text-white"
        style={{
          boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
          WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
          MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
        }}
      >
        <div className="text-center font-semibold text-3xl">New Product</div>
        <form className="flex flex-col items-center mt-5">
          <div className="w-full flex justify-between my-2.5 flex-wrap">
            <label>Poster</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Movie / Show Name"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Cost</label>
            <input
              type="number"
              name="cost"
              placeholder="Movie / Show Cost"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              placeholder="Movie / Show Rating"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Genre</label>
            <input
              type="text"
              placeholder="',' i.e: Mystery, Horror"
              name="genre"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Description</label>
            <input
              type="text"
              placeholder="Movie/Show-Description"
              name="description"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Age Rating</label>
            <input
              type="text"
              placeholder="UA"
              name="ageRating"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Release-Year</label>
            <input
              type="text"
              placeholder="Released Year"
              name="year"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Runtime</label>
            <input
              type="text"
              placeholder="Runtime in minutes"
              name="runtime"
              onChange={changeHandler}
              className="border-none h-10 border-b border-gray-300 p-2.5 rounded-lg text-lg"
            />
          </div>
          <div className="w-full flex justify-between my-2.5">
            <label>Type</label>
            <select 
              name="type" 
              onChange={changeHandler}
              className="h-10 w-2/5 text-center text-lg border-b border-gray-300 rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="movies">Movies</option>
              <option value="shows">Tv-Show</option>
            </select>
          </div>
          <button
            onClick={clickHandler}
            className={`w-36 h-10 text-xl border-none text-white p-1 rounded-lg text-center cursor-pointer mt-8 ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isButtonDisabled}
            style={{
              backgroundColor: isButtonDisabled ? 'salmon' : '#45a049'
            }}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewMovie;
