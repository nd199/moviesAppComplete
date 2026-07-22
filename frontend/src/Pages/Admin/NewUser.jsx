import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../AxiosMethods';

const NewUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', fullName: '', email: '', password: '',
    phone: '', address: '', gender: 'male', active: 'yes'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: formData.fullName, email: formData.email, password: formData.password,
        phoneNumber: formData.phone, address: formData.address, imageUrl: null,
        isEmailVerified: true, isLogged: true, isRegistered: true
      };
      await api.post('/auth/customers', userData);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const inputClass = "mt-2 h-10 w-full rounded-xl border border-surface-700 bg-surface-800 px-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white">Create User</h1>
          <p className="text-sm text-surface-500 mt-0.5">Add a new account to your OTT platform</p>
        </div>
        <button onClick={() => navigate('/admin/users')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-semibold text-surface-500 hover:text-white hover:border-surface-600 transition-colors shrink-0">
          <HiArrowLeft className="h-4 w-4" />
          Back to Users
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Account Details</div>
          <div className="mt-1 text-sm text-surface-500">Credentials and profile information.</div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><label className="block text-sm font-medium text-surface-500">Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="john_ott" className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-surface-500">Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-surface-500">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@domain.com" className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-surface-500">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-surface-500">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 123 456 78" className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-surface-500">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Los Angeles, US" className={inputClass} /></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-surface-500">Gender</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }].map((opt) => (
                    <label key={opt.value} className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                      formData.gender === opt.value ? 'border-brand-500/30 bg-brand-500/15 text-brand-300' : 'border-surface-700 bg-surface-800 text-surface-500 hover:bg-surface-700'
                    }`}>
                      <input type="radio" name="gender" value={opt.value} checked={formData.gender === opt.value} onChange={handleChange} className="hidden" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-500">Status</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[{ label: 'Active', value: 'yes' }, { label: 'Inactive', value: 'no' }].map((opt) => (
                    <label key={opt.value} className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                      formData.active === opt.value
                        ? opt.value === 'yes' ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300' : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                        : 'border-surface-700 bg-surface-800 text-surface-500 hover:bg-surface-700'
                    }`}>
                      <input type="radio" name="active" value={opt.value} checked={formData.active === opt.value} onChange={handleChange} className="hidden" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
                Create User
              </button>
            </div>
          </form>
        </div>

        <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
          <div className="text-lg font-semibold text-white">Avatar</div>
          <div className="mt-1 text-sm text-surface-500">Optional profile picture.</div>
          <div className="mt-6">
            <div className="flex items-center gap-4 rounded-xl border border-surface-700 bg-surface-800 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/30 to-accent-500/30 text-lg font-semibold text-white border border-surface-700">
                {(formData.fullName || formData.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{formData.fullName || 'New User'}</div>
                <div className="mt-1 text-xs text-surface-500">{formData.email || 'email@domain.com'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
