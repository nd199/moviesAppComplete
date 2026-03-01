import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const NewUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    gender: 'male',
    active: 'yes'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        address: formData.address,
        imageUrl: null,
        isEmailVerified: true,
        isLogged: true,
        isRegistered: true
      };

      await authService.register(userData);
      toast.success('User created successfully!');
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Create User</h1>
          <p className="text-sm text-slate-400">Add a new account to your OTT platform</p>
        </div>
        <button
          onClick={() => navigate('/users')}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
          type="button"
        >
          Back to Users
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Account Details</div>
          <div className="mt-1 text-sm text-slate-400">Credentials and profile information.</div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_ott"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@domain.com"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 123 456 78"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Los Angeles, US"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Gender</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                        formData.gender === opt.value
                          ? 'border-red-500/30 bg-red-500/15 text-red-100'
                          : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={opt.value}
                        checked={formData.gender === opt.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Status</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: 'Active', value: 'yes' },
                    { label: 'Inactive', value: 'no' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                        formData.active === opt.value
                          ? opt.value === 'yes'
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100'
                            : 'border-amber-500/30 bg-amber-500/15 text-amber-100'
                          : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="active"
                        value={opt.value}
                        checked={formData.active === opt.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:from-red-400 hover:to-purple-500"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="text-lg font-semibold text-slate-100">Avatar</div>
          <div className="mt-1 text-sm text-slate-400">Optional profile picture.</div>
          <div className="mt-6">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 to-purple-600/30 text-lg font-semibold text-slate-100 border border-white/10">
                {(formData.fullName || formData.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200">{formData.fullName || 'New User'}</div>
                <div className="mt-1 text-xs text-slate-400">{formData.email || 'email@domain.com'}</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Avatar upload can be added when the backend supports storing profile images.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
