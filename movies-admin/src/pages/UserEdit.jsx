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
  const userId = Number(location.pathname.split("/")[3]);
  
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
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Edit User</h1>
          <p className="text-sm text-slate-400">Update profile and contact details</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/users/new">
            <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
              Add New
            </button>
          </Link>
          <button
            onClick={() => navigate('/users')}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            type="button"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex items-center gap-4">
            <img
              src={imageUrl || defaultSelected}
              alt=""
              className="h-14 w-14 rounded-full object-cover border border-white/10"
            />
            <div>
              <div className="text-sm font-semibold text-slate-100">{name || user?.name}</div>
              <div className="mt-1 text-xs text-slate-400">{email || user?.email}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">Active</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">User</span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400">Account</div>
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <FaUser className="text-slate-400" />
                  <span>{email || user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-slate-400" />
                  <span style={{ display: "none" }}>{createdAt}</span>
                  {createdAt && (
                    <span>{format(new Date(createdAt), "MMMM dd, yyyy HH:mm")}</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400">Contact</div>
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-slate-400" />
                  <span>{phoneNumber || user?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-slate-400" />
                  <span>{email || user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-slate-400" />
                  <span>{address || user?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Edit</div>
          <div className="mt-1 text-sm text-slate-400">Update details and optionally replace avatar.</div>

          <form onSubmit={userUpdateHandler} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  name="name"
                  placeholder={user?.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="text"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  name="email"
                  placeholder={user?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Phone</label>
                <input
                  type="text"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  name="phoneNumber"
                  placeholder={user?.phoneNumber}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Address</label>
                <input
                  type="text"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  name="address"
                  placeholder={user?.address}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-slate-200">Avatar</div>
                <div className="mt-3 flex flex-col items-center">
                  <img
                    src={imageUrl || defaultSelected}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover border border-white/10"
                  />
                  <label htmlFor="file" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
                    <FaUpload />
                    Upload
                  </label>
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
