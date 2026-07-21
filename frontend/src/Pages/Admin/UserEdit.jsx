import React, { useState, useEffect } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaEnvelope, FaUser, FaPhone, FaUpload } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { fetchUsers, updateUser } from '../../services/adminApi';

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [address, setAddress] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await fetchUsers();
        const currentUser = users.find(u => u.id === userId);
        if (currentUser) {
          setUser(currentUser);
          setName(currentUser.name || "");
          setEmail(currentUser.email || "");
          setPhoneNumber(currentUser.phoneNumber || "");
          setImageUrl(currentUser.imageUrl || "");
          setAddress(currentUser.address || "");
          setCreatedAt(currentUser.createdAt || "");
        } else {
          toast.error('User not found');
          navigate('/admin/users');
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error('Failed to fetch user');
        navigate('/admin/users');
      }
    };
    fetchUserData();
  }, [userId, navigate]);

  const userUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name, email, phoneNumber, address, imageUrl: null,
        isEmailVerified: true, isLogged: true, isRegistered: true
      };
      await updateUser(userId, userData);
      toast.success('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error('Failed to update user');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Edit User</h1>
          <p className="text-sm text-surface-500 mt-0.5">Update profile and contact details</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/users/new">
            <button className="rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
              Add New
            </button>
          </Link>
          <button onClick={() => navigate('/admin/users')}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors">
            <HiArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <img src={imageUrl || `https://ui-avatars.com/api/?name=${name || 'User'}&background=7c3aed&color=fff`}
              alt="" className="h-14 w-14 rounded-full object-cover border border-surface-700" />
            <div>
              <div className="text-sm font-semibold text-white">{name || user?.name}</div>
              <div className="mt-1 text-xs text-surface-500">{email || user?.email}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">Active</span>
            <span className="rounded-full border border-surface-700 bg-surface-800 px-3 py-1 text-xs font-semibold text-white">User</span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Account</div>
              <div className="mt-2 space-y-2 text-sm text-white">
                <div className="flex items-center gap-2"><FaUser className="text-surface-500" /><span>{email || user?.email}</span></div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-surface-500" />
                  {createdAt ? <span>{format(new Date(createdAt), "MMM dd, yyyy HH:mm")}</span> : <span>—</span>}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Contact</div>
              <div className="mt-2 space-y-2 text-sm text-white">
                <div className="flex items-center gap-2"><FaPhone className="text-surface-500" /><span>{phoneNumber || user?.phoneNumber || '—'}</span></div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-surface-500" /><span>{email || user?.email}</span></div>
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-surface-500" /><span>{address || user?.address || '—'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Edit</div>
          <div className="mt-1 text-sm text-surface-500">Update details and optionally replace avatar.</div>

          <form onSubmit={userUpdateHandler} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-500">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.name}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Email</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={user?.email}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Phone</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={user?.phoneNumber}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={user?.address}
                  className="mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors" />
              </div>
              <div className="pt-2">
                <button type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
                  Save Changes
                </button>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-surface-700 bg-surface-800 p-4">
                <div className="text-sm font-semibold text-white">Avatar</div>
                <div className="mt-3 flex flex-col items-center">
                  <img src={imageUrl || `https://ui-avatars.com/api/?name=${name || 'User'}&background=7c3aed&color=fff`}
                    alt="" className="h-20 w-20 rounded-full object-cover border border-surface-700" />
                  <label htmlFor="file" className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-surface-700 bg-surface-700 px-3 py-2 text-xs font-semibold text-white hover:bg-surface-600 transition-colors">
                    <FaUpload />
                    Upload
                  </label>
                  <input type="file" id="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
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
