import { useState } from 'react';
import { HiUser, HiMail, HiShieldCheck, HiLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      toast.success('Logged out successfully');
      navigate('/super-admin/login');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Superadmin Dashboard</h1>
            <p className="text-gray-400">Welcome to the MoviesApp administration panel</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <HiLogout className="w-5 h-5" />
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Admin Management Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center mb-4">
              <HiUser className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Admin Management</h2>
            </div>
            <p className="text-gray-400 mb-4">Create and manage admin accounts</p>
            <button 
              onClick={() => navigate('/super-admin/invite')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Invite Admin
            </button>
          </div>

          {/* Email Invites Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center mb-4">
              <HiMail className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold">Email Invites</h2>
            </div>
            <p className="text-gray-400 mb-4">Send invitation emails to new admins</p>
            <button 
              onClick={() => navigate('/super-admin/invite')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Send Invite
            </button>
          </div>

          {/* Security Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center mb-4">
              <HiShieldCheck className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            <p className="text-gray-400 mb-4">Manage security settings</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Security Settings
            </button>
          </div>

        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Session Timeout</h3>
            <p className="text-3xl font-bold text-red-500">5 minutes</p>
            <p className="text-gray-400 text-sm mt-1">Maximum security</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Refresh Tokens</h3>
            <p className="text-3xl font-bold text-gray-500">Disabled</p>
            <p className="text-gray-400 text-sm mt-1">For security</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Role</h3>
            <p className="text-3xl font-bold text-green-500">SUPERADMIN</p>
            <p className="text-gray-400 text-sm mt-1">Full access</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
