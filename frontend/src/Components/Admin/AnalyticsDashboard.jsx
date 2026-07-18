import { useState, useEffect } from 'react';
import AdvancedCharts from './AdvancedCharts';
import ChartSelector from './ChartSelector';
import { adminAPI } from '../../AxiosMethods';

const AnalyticsDashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [movieStats, setMovieStats] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStatsRes, contentStatsRes] = await Promise.all([
          adminAPI.getUserStats().catch(() => ({ data: [] })),
          adminAPI.getContentStats().catch(() => ({ data: {} })),
        ]);

        const users = userStatsRes.data || [];
        const formattedUserStats = users.map(m => ({
          name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m.month - 1] || `M${m.month}`,
          'Active User': m.total || 0,
          'New Users': Math.floor((m.total || 0) * 0.3),
        }));
        setUserStats(formattedUserStats.length > 0 ? formattedUserStats : [
          { name: 'Jan', 'Active User': 0, 'New Users': 0 },
        ]);

        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const quarterlyRevenue = quarters.map((q, i) => {
          const months = users.filter(m => Math.ceil(m.month / 3) === i + 1);
          const total = months.reduce((sum, m) => sum + (m.total || 0), 0);
          return { name: q, revenue: total * 299, profit: Math.floor(total * 299 * 0.4), expenses: Math.floor(total * 299 * 0.6) };
        });
        setRevenueData(quarterlyRevenue);

        const content = contentStatsRes.data || {};
        setMovieStats([
          { name: 'Movies', count: content.totalMovies || 0, views: (content.totalMovies || 0) * 150 },
          { name: 'TV Shows', count: content.totalShows || 0, views: (content.totalShows || 0) * 200 },
        ]);

        const activeSubs = content.activeSubscriptions || 0;
        setSubscriptionData([
          { name: 'Active', users: activeSubs, revenue: activeSubs * 299 },
          { name: 'Total Users', users: users.reduce((s, m) => s + (m.total || 0), 0), revenue: 0 },
        ]);
      } catch {
        setUserStats([{ name: 'No Data', 'Active User': 0, 'New Users': 0 }]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Advanced Analytics</h2>
      <ChartSelector data={userStats} title="User Analytics" />
      <ChartSelector data={revenueData} title="Revenue Analytics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Content Distribution</h3>
          <AdvancedCharts data={movieStats} chartType="bar" />
        </div>
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">User Overview</h3>
          <AdvancedCharts data={subscriptionData} chartType="pie" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
