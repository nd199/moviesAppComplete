import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { systemAPI } from '../services/api';
import { HiUserPlus, HiUsers, HiShieldCheck, HiClock } from 'react-icons/hi2';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ customers: 0, admins: 0, loading: true });
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, adminsRes] = await Promise.all([
          systemAPI.getCustomers(),
          systemAPI.getAdmins(),
        ]);
        setStats({
          customers: Array.isArray(customersRes.data) ? customersRes.data.length : 0,
          admins: Array.isArray(adminsRes.data) ? adminsRes.data.length : 0,
          loading: false,
        });
      } catch (error) {
        setStats({ customers: 0, admins: 0, loading: false });
      }
    };

    const checkHealth = async () => {
      try {
        await systemAPI.getHealth();
        setHealth('healthy');
      } catch {
        setHealth('unhealthy');
      }
    };

    fetchStats();
    checkHealth();
  }, []);

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">System Overview</h2>
            <p className="text-gray-400 mt-1">Monitor your platform health and administrator accounts</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            health === 'healthy'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : health === 'unhealthy'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-gray-500/10 border border-gray-500/20'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${
              health === 'healthy' ? 'bg-emerald-500 animate-pulse' : health === 'unhealthy' ? 'bg-red-500' : 'bg-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              health === 'healthy' ? 'text-emerald-400' : health === 'unhealthy' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {health === 'healthy' ? 'System Healthy' : health === 'unhealthy' ? 'System Issues' : 'Checking...'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-red-600 via-red-700 to-orange-700 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-white/80">Total Admins</span>
              <p className="text-3xl font-bold mt-1">{stats.admins}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <HiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-white/80">Total Users</span>
              <p className="text-3xl font-bold mt-1">{stats.customers}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <HiShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-white/80">System Status</span>
              <p className="text-3xl font-bold mt-1">Active</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <HiClock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/super-admin/invite')}
            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <HiUserPlus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Invite Admin</p>
              <p className="text-xs text-gray-500">Send a new invitation</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/super-admin/admins')}
            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <HiUsers className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">View Admins</p>
              <p className="text-xs text-gray-500">Manage all administrators</p>
            </div>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <HiShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Refresh Data</p>
              <p className="text-xs text-gray-500">Reload system stats</p>
            </div>
          </button>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Security Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SecurityItem label="Login Protection" status="active" detail="Rate limiting enabled" />
          <SecurityItem label="Token Expiry" status="active" detail="5 min for superadmin" />
          <SecurityItem label="Session Timeout" status="active" detail="15 min idle limit" />
          <SecurityItem label="CSRF Protection" status="active" detail="Header validation" />
        </div>
      </div>
    </div>
  );
};

const SecurityItem = ({ label, status, detail }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{detail}</p>
    </div>
  </div>
);

export default Dashboard;
