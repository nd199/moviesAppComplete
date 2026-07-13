import { useState, useEffect } from 'react';
import { systemAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ customers: 0, admins: 0, loading: true });

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
        console.error('Failed to fetch stats:', error);
        setStats({ customers: 0, admins: 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">System Overview</h2>
          <p className="text-gray-400 mt-1">Monitor your platform health and administrator accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-red-600 via-red-700 to-orange-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-sm font-medium text-white/80">Total Admins</span>
            <p className="text-3xl font-bold mt-1">{stats.admins}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-sm font-medium text-white/80">Total Users</span>
            <p className="text-3xl font-bold mt-1">{stats.customers}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <span className="text-sm font-medium text-white/80">System Status</span>
            <p className="text-3xl font-bold mt-1">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
