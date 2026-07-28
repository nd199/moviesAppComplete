import { useEffect, useMemo, useState } from 'react';
import Statistics from '../../Components/Admin/Statistics';
import ChartSelector from '../../Components/Admin/ChartSelector';
import AnalyticsDashboard from '../../Components/Admin/AnalyticsDashboard';
import SystemStatus from '../../Components/Admin/SystemStatus';
import WidgetsLarge from '../../Components/Admin/WidgetsLarge';
import QuickActions from '../../Components/Admin/QuickActions';
import PlatformMetrics from '../../Components/Admin/PlatformMetrics';
import RevenueSummary from '../../Components/Admin/RevenueSummary';
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
          "Active Users": item.total,
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-48 bg-surface-800 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-surface-800 rounded-2xl" />
            <div className="h-32 bg-surface-800 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-surface-800 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-surface-800 rounded-2xl" />
          <div className="h-80 bg-surface-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Welcome back! Here's your platform overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-xl">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            System Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Statistics />
        </div>
        <div className="space-y-6">
          <RevenueSummary />
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSelector data={userStats} title="User Activity Trends" />
        </div>
        <div className="space-y-6">
          <AnalyticsDashboard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WidgetsLarge />
        </div>
        <div className="space-y-6">
          <PlatformMetrics />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;