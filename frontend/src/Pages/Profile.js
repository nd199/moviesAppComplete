import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {LocationOnOutlined, MailOutlined, Person2Outlined, PhoneOutlined, PublishOutlined,} from "@mui/icons-material";
import {fetchUsers, updateProfile} from "../Network/ApiCalls";
import LinearProgress from "@mui/material/LinearProgress";
import {getDownloadURL, getStorage, ref, uploadBytesResumable,} from "firebase/storage";
import "./Profile.css";
import {app} from "../Firebase";

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.user?.currentUser);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [imageUrl, setImageUrl] = useState(user.imageUrl);
    const [address, setAddress] = useState(user.address);
    const [avatar, setAvatar] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showEditForm, setShowEditForm] = useState(false);

    const userUpdateHandler = async (e) => {
        e.preventDefault();
        try {
            if (avatar) {
                const fileName = new Date().getTime() + avatar.name;
                const storage = getStorage(app);
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, avatar);

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
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setImageUrl(downloadURL);
                        await updateProfile(dispatch, {
                            name,
                            email,
                            phoneNumber,
                            address,
                            imageUrl: downloadURL,
                        }, user.id);
                        fetchUsers(dispatch);
                    }
                );
            } else {
                await updateProfile(dispatch, {
                    name,
                    email,
                    phoneNumber,
                    address,
                    imageUrl,
                }, user.id);
                fetchUsers(dispatch);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profileContainer">
            <div className="profileTitleContainer">
                <h1 className="profileTitle"> Your Profile</h1>
            </div>
            <div className="profileContentContainer">
                <div className="profileInfo">
                    <div className="profileInfoContainer">
                        <img
                            src={imageUrl || "https://example.com/default-image.jpg"}
                            alt=""
                            className="profileInfoImg"
                        />
                        <div className="profileInfoText">
                            <h3 className="profileInfoName">{name || user.name}</h3>
                        </div>
                        <div className="profileDetails">
                            <span className="profileInfoTitle">Account Details</span>
                            <div className="profileInfoItem">
                                <Person2Outlined/>
                                <span className="profileShowInfo">{name || user.name}</span>
                            </div>
                            <div className="profileInfoItem">
                                <MailOutlined/>
                                <span className="profileShowInfo">{email || user.email}</span>
                            </div>
                            <div className="profileInfoItem">
                                <PhoneOutlined/>
                                <span className="profileShowInfo">{phoneNumber || user.phoneNumber}</span>
                            </div>
                            <div className="profileInfoItem">
                                <LocationOnOutlined/>
                                <span className="profileShowInfo">{address || user.address}</span>
                            </div>
                        </div>
                        <button onClick={() => setShowEditForm("true")} className="profileUpdateButton"
                                type="button">Edit
                        </button>
                    </div>
                </div>
                {showEditForm && <div className="profileUpdate">
                    <button onClick={() => setShowEditForm(!showEditForm)}
                            className="editProfileCloseButton">X
                    </button>
                    <form className="profileUpdateForm" onSubmit={userUpdateHandler}>
                        <div className="profileUpdateRight">
                            <div className="profileUpdateUpload">
                                <img
                                    src={imageUrl || "https://example.com/default-image.jpg"}
                                    alt=""
                                    className="profileUpdateImg"
                                />
                                <label htmlFor="file"
                                       style={{
                                           padding: "5px", border: "1px solid orange", borderRadius: "10px",
                                           display: "flex", alignItems: "center", justifyContent: "space-between"
                                       }}>
                                    <PublishOutlined className="profileUpdateIcon"/> <span>Upload</span>
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    style={{display: "none"}}
                                    onChange={handleFileChange}
                                />
                                <LinearProgress
                                    variant="determinate"
                                    value={uploadProgress}
                                    style={{height: "10px", borderRadius: "5px", marginTop: "10px"}}
                                />
                            </div>
                        </div>
                        <div className="profileUpdateLeft">
                            <div className="profileUpdateItem">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="profileUpdateInput"
                                    name="name"
                                    placeholder={user.name}
                                    value={name}
                                    onChange={(e) => setName(e.target?.value)}
                                />
                            </div>
                            <div className="profileUpdateItem">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="profileUpdateInput"
                                    name="email"
                                    placeholder={user.email}
                                    value={email}
                                    onChange={(e) => setEmail(e.target?.value)}
                                    disabled
                                />
                            </div>
                            <div className="profileUpdateItem">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="profileUpdateInput"
                                    name="phoneNumber"
                                    placeholder={user.phoneNumber}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target?.value)}
                                />
                            </div>
                            <div className="profileUpdateItem">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="profileUpdateInput"
                                    name="address"
                                    placeholder={user.address}
                                    value={address}
                                    onChange={(e) => setAddress(e.target?.value)}
                                />
                            </div>
                        </div>
                        <button className="profileUpdateButton" type="submit">
                            Update
                        </button>
                    </form>
                </div>}
            </div>
        </div>
    );
};

export default Profile;
