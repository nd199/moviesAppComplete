import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiArrowRightOnRectangle, HiUser, HiCog6Tooth } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const admin = useSelector((state) => state.auth.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {admin?.name?.charAt(0) || 'A'}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-100">{admin?.name || 'Admin'}</p>
          <p className="text-xs text-slate-400">{admin?.email || 'admin@example.com'}</p>
        </div>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur shadow-2xl shadow-black/50 z-20">
            <div className="p-3 border-b border-white/10">
              <p className="text-sm font-medium text-slate-100">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400">{admin?.email || 'admin@example.com'}</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleSettings}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded transition-colors"
              >
                <HiCog6Tooth className="mr-3 h-4 w-4" />
                Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded transition-colors"
              >
                <HiArrowRightOnRectangle className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileDropdown;
