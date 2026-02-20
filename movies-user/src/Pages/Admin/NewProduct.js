import React, { useEffect, useState } from "react";
import "./NewProduct.css";

const NewProduct = () => {
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

    console.log("File upload functionality disabled - Firebase removed");
    alert("File upload functionality is currently disabled. Please configure an alternative storage solution.");
  };

  return (
    <div className="newProduct">
      <div className="productCreate">
        <div className="pTitle">New Product</div>
        <form className="pForm">
          <div className="pItem">
            <label>Poster</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="pItem">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Movie / Show Name"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Cost</label>
            <input
              type="number"
              name="cost"
              placeholder="Movie / Show Cost"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              placeholder="Movie / Show Rating"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Genre</label>
            <input
              type="text"
              placeholder="',' i.e: Mystery, Horror"
              name="genre"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Description</label>
            <input
              type="text"
              placeholder="Movie/Show-Description"
              name="description"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Age Rating</label>
            <input
              type="text"
              placeholder="UA"
              name="ageRating"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Release-Year</label>
            <input
              type="text"
              placeholder="Released Year"
              name="year"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Runtime</label>
            <input
              type="text"
              placeholder="Runtime in minutes"
              name="runtime"
              onChange={changeHandler}
            />
          </div>
          <div className="pItem">
            <label>Type</label>
            <select name="type" onChange={changeHandler}>
              <option value="">Select Type</option>
              <option value="movies">Movies</option>
              <option value="shows">Tv-Show</option>
            </select>
          </div>
          <button
            onClick={clickHandler}
            className={`pButton ${isButtonDisabled ? "disabled" : ""}`}
            disabled={isButtonDisabled}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
