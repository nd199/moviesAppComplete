import React, { useEffect, useMemo, useState } from 'react';
import FeaturesInfo from '../components/FeaturesInfo';
import Chart from '../components/Chart';
import WidgetsSmall from '../components/WidgetsSmall';
import WidgetsLarge from '../components/WidgetsLarge';
import Statistics from '../components/Statistics';
import ChartSelector from '../components/ChartSelector';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import SystemStatus from '../components/SystemStatus';
import { fetchUserStats } from '../services/adminApi';
import api from '../services/api';

const Dashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MONTHS = useMemo(() => {
    return [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
  }, []);

  useEffect(() => {
    console.log('Dashboard: Component mounted!');
    // Fetch customer count directly
    const fetchCustomerCount = async () => {
      try {
        const response = await api.get('/customers');
        console.log('Dashboard: /customers response:', response.data);
        setCustomerCount(Array.isArray(response.data) ? response.data.length : response.data?.total || 0);
      } catch (error) {
        console.error('Dashboard: Error fetching customers:', error);
      }
    };
    
    const getStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const statsData = await fetchUserStats();
        const aggregatedData = statsData.reduce((acc, item) => {
          const month = item.month;
          if (!acc[month]) {
            acc[month] = { month, total: 0 };
          }
          acc[month].total += item.total;
          return acc;
        }, {});
        const formattedData = Object.values(aggregatedData).map((item) => ({
          name: MONTHS[item.month - 1],
          "Active User": item.total,
        }));

        setUserStats(formattedData);
      } catch (error) {
        console.error("Dashboard: Error fetching user stats:", error);
        setError("Failed to load statistics");
        // Set some dummy data so the dashboard doesn't look empty
        setUserStats([
          { name: "Jan", "Active User": 120 },
          { name: "Feb", "Active User": 150 },
          { name: "Mar", "Active User": 180 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerCount();
    getStats();
  }, [MONTHS]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-lg text-slate-300">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Cinematic overview of your OTT platform</p>
            </div>
            <div className="hidden md:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 overflow-auto">
        {/* Stats Overview - Replace hardcoded cards with Statistics component */}
        <Statistics />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartSelector
              data={userStats}
              title="User Analytics"
            />
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Conversion Rate</span>
                <span className="text-sm font-semibold text-slate-100">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Avg. Order Value</span>
                <span className="text-sm font-semibold text-slate-100">$89.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Customer Retention</span>
                <span className="text-sm font-semibold text-slate-100">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Server Uptime</span>
                <span className="text-sm font-semibold text-emerald-400">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Advanced Analytics</h2>
          <AnalyticsDashboard />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Recent Orders</h2>
            <WidgetsLarge />
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <SystemStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
