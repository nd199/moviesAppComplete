import { useEffect, useMemo, useState } from 'react';
import Statistics from '../../Components/Admin/Statistics';
import ChartSelector from '../../Components/Admin/ChartSelector';
import AnalyticsDashboard from '../../Components/Admin/AnalyticsDashboard';
import SystemStatus from '../../Components/Admin/SystemStatus';
import WidgetsLarge from '../../Components/Admin/WidgetsLarge';
import QuickActions from '../../Components/Admin/QuickActions';
import PlatformMetrics from '../../Components/Admin/PlatformMetrics';
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
      <div className="space-y-6 animate-pulse">
        {/* Skeleton welcome */}
        <div className="h-32 bg-surface-800 rounded-2xl" />
        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-surface-800 rounded-2xl" />)}
        </div>
        {/* Skeleton chart */}
        <div className="h-80 bg-surface-800 rounded-2xl" />
        {/* Skeleton bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-surface-800 rounded-2xl" />
          <div className="h-64 bg-surface-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner — refined with subtle pattern */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl shadow-brand-500/10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-0.5 h-32 bg-white/10 -translate-y-1/2 rotate-45" />
        <div className="absolute bottom-4 right-16 w-12 h-12 border border-white/10 rounded-2xl rotate-12" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, Admin</h2>
            <p className="text-white/70 mt-1.5 text-sm sm:text-base">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              System Online
            </span>
          </div>
        </div>
      </div>

      <Statistics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSelector data={userStats} title="User Analytics" />
        </div>
        <QuickActions />
      </div>

      <AnalyticsDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WidgetsLarge />
        <PlatformMetrics />
        <SystemStatus />
      </div>
    </div>
  );
};

export default Dashboard;
