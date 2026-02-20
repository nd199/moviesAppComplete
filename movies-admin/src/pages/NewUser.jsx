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
    <div className="w-full h-[calc(100vh-60px)] p-5">
      <h1 className="text-2xl font-semibold mb-5">New User</h1>
      <form onSubmit={handleSubmit} className="flex flex-wrap relative">
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">UserName</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="John222"
            className="h-10 border border-gray-300 p-2.5 rounded-lg"
          />
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="h-10 border border-gray-300 p-2.5 rounded-lg"
          />
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="John@gmail.com"
            className="h-10 border border-gray-300 p-2.5 rounded-lg"
          />
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            className="h-10 border border-gray-300 p-2.5 rounded-lg"
          />
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 123 456 78"
            className="h-10 border border-gray-300 p-2.5 rounded-lg"
          />
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Los Vegas, US"
            className="h-10 border border-gray-300 p-2.5 rounded-lg"
          />
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Gender</label>
          <div className="flex gap-4 mt-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>
        
        <div className="w-[400px] flex-col mx-5 my-2.5">
          <label className="text-xl font-semibold text-gray-700 mb-2">Active</label>
          <select
            name="active"
            value={formData.active}
            onChange={handleChange}
            className="h-10 rounded-lg border border-gray-300"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        
        <div className="absolute">
          <button
            type="submit"
            className="w-36 h-10 text-xl border-none text-white p-1 rounded-lg cursor-pointer mt-36 absolute left-[40%]"
            style={{
              transform: 'translateX(-100%)',
              backgroundColor: 'salmon'
            }}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;
