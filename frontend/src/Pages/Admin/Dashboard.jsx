import { useEffect, useMemo, useState } from 'react';
import Statistics from '../../Components/Admin/Statistics';
import ChartSelector from '../../Components/Admin/ChartSelector';
import AnalyticsDashboard from '../../Components/Admin/AnalyticsDashboard';
import SystemStatus from '../../Components/Admin/SystemStatus';
import WidgetsLarge from '../../Components/Admin/WidgetsLarge';
import { fetchUserStats } from '../../services/adminApi';

const Dashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const MONTHS = useMemo(() => [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ], []);

  useEffect(() => {
    const getStats = async () => {
      try {
        const statsData = await fetchUserStats();
        const aggregatedData = statsData.reduce((acc, item) => {
          const month = item.month;
          if (!acc[month]) acc[month] = { month, total: 0 };
          acc[month].total += item.total;
          return acc;
        }, {});
        const formattedData = Object.values(aggregatedData).map((item) => ({
          name: MONTHS[item.month - 1],
          "Active User": item.total,
        }));
        setUserStats(formattedData);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, [MONTHS]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-24 w-12 h-12 bg-white/10 rounded-2xl rotate-12" />
        <div className="absolute bottom-6 right-12 w-8 h-8 bg-white/10 rounded-xl -rotate-6" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Welcome back, Admin</h2>
          <p className="text-white/80 mt-1">Here's what's happening with your platform today.</p>
        </div>
      </div>

      <Statistics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSelector data={userStats} title="User Analytics" />
        </div>

        {/* Quick Stats - dark card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h3 className="text-base font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Conversion Rate', value: '3.2%', accent: 'text-emerald-400' },
                { label: 'Avg. Order Value', value: '$89.50', accent: 'text-violet-400' },
                { label: 'Customer Retention', value: '78%', accent: 'text-blue-400' },
                { label: 'Server Uptime', value: '99.9%', accent: 'text-amber-400' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-sm text-white/60">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.accent}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnalyticsDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetsLarge />
        <SystemStatus />
      </div>
    </div>
  );
};

export default Dashboard;
