import React, { useEffect, useState } from "react";
import "./NewProduct.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { addProduct} from "../redux/ApiCalls";
import { useDispatch } from "react-redux";

const NewProduct = () => {
  const [input, setInput] = useState({});
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();

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

  const changeCategoryHandler = (e) => {
    setCategories(e.target.value.split(","));
  };

  const clickHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed: ", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const product = { 
            ...input, 
            poster: downloadURL, 
            genre: categories.join(",") 
          };
          addProduct(product, dispatch);
          
        } catch (error) {
          console.error("Error getting download URL: ", error);
        }
      }
    );

    try {
      await uploadTask;
    } catch (error) {
      console.error("Upload failed: ", error);
    }
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
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              style={{
                height: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
          </Box>
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
              onChange={changeCategoryHandler}
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
