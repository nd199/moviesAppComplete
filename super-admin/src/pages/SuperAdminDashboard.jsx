import { useState } from 'react';
import { HiUser, HiLogout } from 'react-icons/hi';
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

        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
