import React, { useState, useEffect } from "react";
import "./UserInfoAndEdit.css";
import {
  CalendarTodayOutlined,
  LocationOnOutlined,
  MailOutlined,
  Person2Outlined,
  PhoneAndroidOutlined,
  PublishOutlined,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser } from "../redux/ApiCalls";
import { format } from "date-fns";

const UserInfoAndEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = Number(location.pathname.split("/")[2]);
  const user = useSelector((state) =>
    state.user?.users?.find((user) => user.id === userId)
  );

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [imageUrl, setImageUrl] = useState(user.imageUrl);
  const [address, setAddress] = useState(user.address);
  const [createdAt, setFormatted] = useState(user.createdAt);

  const userUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser(dispatch, user.id, {
        name,
        email,
        phoneNumber,
        address,
      });
      fetchUsers(dispatch);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="uEdit">
      <div className="uTitleContainer">
        <h1 className="uTitle">Edit User</h1>
        <Link to={"/NewUser"}>
          <button className="userAdd">Create</button>
        </Link>
      </div>
      <div className="uContainer">
        <div className="uInfo">
          <div className="uInfoContainer">
            <img
              src={imageUrl || "https://example.com/default-image.jpg"}
              alt=""
              className="userInfoImg"
            />
            <div className="uInfoText">
              <h3 className="uInfoName">{name || user.name}</h3>
            </div>
            <div className="uInformation">
              <span className="userInfoTitle">Account Details</span>
              <div className="uInfoMore">
                <Person2Outlined />
                <span className="userShowInfo">{email || user.email}</span>
              </div>
              <div className="uInfoMore">
                <CalendarTodayOutlined />
                <span className="userShowInfo" style={{ display: "none" }}>
                  {createdAt}
                </span>
                {format(new Date(createdAt), "MMMM dd, yyyy HH:mm")}
              </div>
              <span className="userInfoTitle">Contact Details</span>
              <div className="uInfoMore">
                <PhoneAndroidOutlined />
                <span className="userShowInfo">
                  {phoneNumber || user.phoneNumber}
                </span>
              </div>
              <div className="uInfoMore">
                <MailOutlined />
                <span className="userShowInfo">{email || user.email}</span>
              </div>
              <div className="uInfoMore">
                <LocationOnOutlined />
                <span className="userShowInfo">{address || user.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="uUpdate">
          <div className="userUpdateTitle">Edit</div>
          <form className="userUpdateForm" onSubmit={userUpdateHandler}>
            <div className="uUpLeft">
              <div className="uUpLeftItem">
                <label>Full Name</label>
                <input
                  type="text"
                  className="userUpInput"
                  name="name"
                  placeholder={user.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="uUpLeftItem">
                <label>Email</label>
                <input
                  type="text"
                  className="userUpInput"
                  name="email"
                  placeholder={user.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="uUpLeftItem">
                <label>Phone</label>
                <input
                  type="text"
                  className="userUpInput"
                  name="phoneNumber"
                  placeholder={user.phoneNumber}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="uUpLeftItem">
                <label>Address</label>
                <input
                  type="text"
                  className="userUpInput"
                  name="address"
                  placeholder={user.address}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="uUpRight">
              <div className="uUpRightUpload">
                <img
                  src={imageUrl || "https://example.com/default-image.jpg"}
                  alt=""
                  className="userUpdateImg"
                />
                <label htmlFor="file">
                  <PublishOutlined className="uUpdateIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
              <button className="userUpdateButton" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoAndEdit;
