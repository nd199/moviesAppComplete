import {
  LocationOnOutlined,
  MailOutlined,
  Person2Outlined,
  PhoneOutlined,
  PublishOutlined,
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToImgBB } from "../../ImgBB";
import { fetchUsers, updateProfile } from "../../Network/ApiCalls";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.currentUser);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEditForm, setShowEditForm] = useState(false);

  const userUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      let updatedImageUrl = imageUrl;
      if (avatar) {
        const url = await uploadToImgBB(avatar, setUploadProgress);
        updatedImageUrl = url;
      }

      const result = await updateProfile(
        dispatch,
        {
          name,
          email,
          phoneNumber,
          address,
          imageUrl: updatedImageUrl,
        },
        user.id
      );

      if (result.success) {
        toast.success("Profile updated!");
        fetchUsers(dispatch);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profileContainer">
      <ToastContainer />
      <div className="profileTitleContainer">
        <h1 className="profileTitle">Your Profile</h1>
      </div>
      <div className="profileContentContainer">
        <div className="profileInfo">
          <div className="profileInfoContainer">
            <div className="profileInfoImgContainer">
              <img
                src={
                  imageUrl ||
                  "https://via.placeholder.com/150/1a1a1a/9ca3af?text=U"
                }
                alt="Profile"
                className="profileInfoImg"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150/1a1a1a/9ca3af?text=U")
                }
              />
            </div>
            <h3 className="profileInfoName">{name || "User"}</h3>
            <div className="profileDetails">
              <span className="profileInfoTitle">Account Details</span>
              <div className="profileInfoItem">
                <Person2Outlined />
                <span>{name || "Not set"}</span>
              </div>
              <div className="profileInfoItem">
                <MailOutlined />
                <span>{email || "Not set"}</span>
              </div>
              <div className="profileInfoItem">
                <PhoneOutlined />
                <span>{phoneNumber || "Not set"}</span>
              </div>
              <div className="profileInfoItem">
                <LocationOnOutlined />
                <span>{address || "Not set"}</span>
              </div>
            </div>
            <button
              onClick={() => setShowEditForm(true)}
              className="profileUpdateButton"
            >
              <PublishOutlined style={{ marginRight: '8px' }} />
              Edit Profile
            </button>
          </div>
        </div>

        {showEditForm && (
          <div className="profileUpdateOverlay">
            <div className="profileUpdate">
              <button
                onClick={() => setShowEditForm(false)}
                className="editProfileCloseButton"
              >
                ✕
              </button>
              <h2 className="profileUpdateTitle">Edit Profile</h2>
              <p className="profileUpdateSubtitle">Update your personal information</p>
              <form className="profileUpdateForm" onSubmit={userUpdateHandler}>
                <div className="profileUpdateRight">
                  <div className="profileUpdateUpload">
                    <img 
                      src={imageUrl || "https://via.placeholder.com/150/1a1a1a/9ca3af?text=U"} 
                      alt="" 
                      className="profileUpdateImg" 
                    />
                    <label htmlFor="file" className="profileUpdateLabel">
                      <PublishOutlined /> Upload Photo
                    </label>
                    <input
                      id="file"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {uploadProgress > 0 && (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        className="uploadProgress"
                      />
                    )}
                  </div>
                </div>
                <div className="profileUpdateLeft">
                  <div className="profileUpdateItem">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="profileUpdateInput"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="profileUpdateItem">
                    <label>Email</label>
                    <input
                      type="email"
                      className="profileUpdateInput"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="profileUpdateItem">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="profileUpdateInput"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="profileUpdateItem">
                    <label>Address</label>
                    <input
                      type="text"
                      className="profileUpdateInput"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="profileUpdateButton">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
