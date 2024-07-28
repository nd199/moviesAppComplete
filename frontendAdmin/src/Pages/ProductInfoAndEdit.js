import React, { useState, useEffect } from "react";
import "./ProductInfoAndEdit.css";
import { Link, useLocation } from "react-router-dom";
import Chart from "../components/Chart";
import { PublishOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct } from "../redux/ApiCalls";

const ProductInfoAndEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const productsId = Number(location.pathname.split("/")[2]);
  const product = useSelector((state) =>
    state.product?.products?.find((product) => product.id === productsId)
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [genre, setGenre] = useState("");
  const [runtime, setRuntime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCost(product.cost || "");
      setGenre(product.genre || "");
      setRuntime(product.runtime || "");
      setImageUrl(product.poster || "");
    }
  }, [product]);

  let entityId = null;
  if (product?.type === "movies") {
    entityId = product?.movie_id;
  } else if (product?.type === "shows") {
    entityId = product?.show_id;
  }

  const productUpdateHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      cost,
      description,
      entityId,
      genre,
      runtime,
      poster: imageUrl,
    };

    try {
      await updateProduct(dispatch, entityId, product.type, updatedProduct);
      fetchProducts(dispatch);
      setCost("");
      setDescription("");
      setGenre("");
      setRuntime("");
    } catch (err) {
      console.error("Error updating product:", err);
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

  return (
    <div className="pEdit">
      <div className="pTitleContainer">
        <h1 className="pTitle">Edit Product</h1>
        <Link to="/NewProduct">
          <button className="productAdd">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={[]} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img
              src={imageUrl || "https://example.com/default-image.jpg"}
              alt=""
              className="productInfoImage"
            />
            <span className="productName">{name || product.name}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <div className="productInfoKey">id:</div>
              <div className="productInfoValue">{product.id}</div>
            </div>
            <div className="productInfoItem">
              <div className="productInfoKey">sales :</div>
              <div className="productInfoValue">4323</div>
            </div>
            <div className="productInfoItem">
              <div className="productInfoKey">genre :</div>
              <div className="productInfoValue">{genre || product.genre}</div>
            </div>
            <div className="productInfoItem">
              <div className="productInfoKey">runtime :</div>
              <div className="productInfoValue">
                {runtime || product.runtime}
              </div>
            </div>
            <div className="productInfoItem">
              <div className="productInfoKey">price :</div>
              <div className="productInfoValue">
                <p>&#8377; {cost || product.cost}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={productUpdateHandler}>
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder={product.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Product Description</label>
            <textarea
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder={product.description}
            />
            <label>Price</label>
            <input
              type="number"
              name="cost"
              onChange={(e) => setCost(e.target.value)}
              value={cost}
              placeholder={product.cost}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              onChange={(e) => setGenre(e.target.value)}
              value={genre}
              placeholder={product.genre}
            />
            <label>Runtime</label>
            <input
              type="text"
              name="runtime"
              onChange={(e) => setRuntime(e.target.value)}
              value={runtime}
              placeholder={product.runtime}
            />
          </div>
          <div className="productFormCentre">
            <h5>{name || product.name}</h5>
            <img
              src={imageUrl || "https://example.com/default-image.jpg"}
              alt=""
              className="productUploadImg"
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <label htmlFor="file">
                <PublishOutlined className="pUpdateIcon" />{" "}
                <p>Upload new Image</p>
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={fileUploadHandler}
              />
            </div>
            {file && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={file}
                  alt="Product Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    padding: "2px",
                    border: "1px solid black",
                  }}
                />
              </div>
            )}
            <button className="productButton" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductInfoAndEdit;