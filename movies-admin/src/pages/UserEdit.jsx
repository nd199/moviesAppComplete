import React, { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaUpload,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { fetchUsers, updateUser } from '../services/adminApi';

const UserEdit = () => {
  const defaultUserPicture = [
    "https://picsum.photos/seed/user1/100/100.jpg",
    "https://picsum.photos/seed/user2/100/100.jpg",
  ];
  const defaultSelected =
    defaultUserPicture[Math.floor(Math.random() * defaultUserPicture.length)];

  const navigate = useNavigate();
  const location = useLocation();
  const userId = Number(location.pathname.split("/")[2]);
  
  // Mock user data - replace with actual API call
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [address, setAddress] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    // Mock fetching user data
    const mockUser = {
      id: userId,
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1 234 567 8900",
      imageUrl: null,
      address: "New York, USA",
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    
    if (mockUser) {
      setName(mockUser.name || "");
      setEmail(mockUser.email || "");
      setPhoneNumber(mockUser.phoneNumber || "");
      setImageUrl(mockUser.imageUrl || "");
      setAddress(mockUser.address || "");
      setCreatedAt(mockUser.createdAt || "");
    }
  }, [userId]);

  const userUpdateHandler = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        name,
        email,
        phoneNumber,
        address,
        imageUrl: null,
        isEmailVerified: true,
        isLogged: true,
        isRegistered: true
      };

      await updateUser(userId, userData);
      toast.success('User updated successfully!');
      navigate('/users');
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error('Failed to update user');
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
    <div className="h-[calc(100vh-60px)] p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit User</h1>
        <Link to="/users/new">
          <button 
            className="w-20 border-none p-1 rounded-lg bg-green-600 cursor-pointer text-white text-xl"
          >
            Create
          </button>
        </Link>
      </div>
      <div className="flex gap-5 mt-5">
        <div 
          className="p-5"
          style={{
            boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
            WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
            MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
          }}
        >
          <div className="flex flex-col items-start gap-5 mx-5">
            <img
              src={imageUrl || defaultSelected}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{name || user?.name}</h3>
            </div>
            <div>
              <span className="font-semibold">Account Details</span>
              <div className="flex items-center gap-2">
                <FaUser />
                <span>{email || user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar />
                <span style={{ display: "none" }}>
                  {createdAt}
                </span>
                {createdAt && (
                  <span>
                    {format(new Date(createdAt), "MMMM dd, yyyy HH:mm")}
                  </span>
                )}
              </div>
              <span className="font-semibold">Contact Details</span>
              <div className="flex items-center gap-2">
                <FaPhone />
                <span>
                  {phoneNumber || user?.phoneNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <span>{email || user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>{address || user?.address}</span>
              </div>
            </div>
          </div>
        </div>
        <div 
          className="p-5"
          style={{
            boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
            WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
            MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
          }}
        >
          <div className="text-lg font-semibold mb-4">Edit</div>
          <form onSubmit={userUpdateHandler} className="flex">
            <div className="flex-col">
              <div className="mb-4">
                <label>Full Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-2 w-full"
                  name="name"
                  placeholder={user?.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label>Email</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-2 w-full"
                  name="email"
                  placeholder={user?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label>Phone</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-2 w-full"
                  name="phoneNumber"
                  placeholder={user?.phoneNumber}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label>Address</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-2 w-full"
                  name="address"
                  placeholder={user?.address}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <img
                  src={imageUrl || defaultSelected}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <FaUpload />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
              <button 
                className="rounded-lg border-none p-1 cursor-pointer text-white text-lg font-normal mt-4"
                style={{ backgroundColor: 'salmon' }}
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
