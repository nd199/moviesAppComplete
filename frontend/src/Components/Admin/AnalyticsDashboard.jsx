import { useState, useEffect } from 'react';
import AdvancedCharts from './AdvancedCharts';
import { adminAPI } from '../../AxiosMethods';
import { HiCurrencyRupee, HiChartBar, HiFilm, HiUser } from 'react-icons/hi2';

const TABS = [
  { id: 'userAnalytics', label: 'Users', icon: HiUser },
  { id: 'revenue', label: 'Revenue', icon: HiCurrencyRupee },
  { id: 'content', label: 'Content', icon: HiFilm },
  { id: 'overview', label: 'Overview', icon: HiChartBar },
];

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('userAnalytics');
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
          name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m.month - 1] || `M${m.month}`,
          'Active Users': m.total || 0,
          'New Users': Math.floor((m.total || 0) * 0.3),
        }));
        setUserStats(formattedUserStats.length > 0 ? formattedUserStats : [
          { name: 'Jan', 'Active Users': 0, 'New Users': 0 },
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
        setUserStats([{ name: 'No Data', 'Active Users': 0, 'New Users': 0 }]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-900 rounded-2xl border border-surface-700 p-6 animate-pulse">
        <div className="h-8 bg-surface-800 rounded w-1/4 mb-6" />
        <div className="h-64 bg-surface-800 rounded" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'userAnalytics':
        return (
          <div className="space-y-4">
            <AdvancedCharts data={userStats} chartType="area" title="User Analytics" height={280} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/50">
                <p className="text-lg font-bold text-white">
                  {userStats.reduce((s, m) => s + (m['Active Users'] || 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-surface-500">Total Active Users</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/50">
                <p className="text-lg font-bold text-white">
                  {userStats.reduce((s, m) => s + (m['New Users'] || 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-surface-500">New Users</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/50">
                <p className="text-lg font-bold text-white">
                  {userStats.length > 0 ? ((userStats[userStats.length - 1]['Active Users'] || 0) - (userStats[0]?.['Active Users'] || 0) > 0 ? '+' : '') + ((userStats[userStats.length - 1]['Active Users'] || 0) - (userStats[0]?.['Active Users'] || 0)).toLocaleString() : '0'}
                </p>
                <p className="text-[10px] text-surface-500">Growth</p>
              </div>
            </div>
          </div>
        );
      case 'revenue':
        return (
          <div className="space-y-4">
            <AdvancedCharts data={revenueData} chartType="bar" title="Revenue Analytics" height={280} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/50">
                <p className="text-lg font-bold text-white">
                  ₹{revenueData.reduce((s, m) => s + (m.revenue || 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-surface-500">Total Revenue</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/50">
                <p className="text-lg font-bold text-white">
                  ₹{revenueData.reduce((s, m) => s + (m.profit || 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-surface-500">Profit</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-800/60 border border-surface-700/50">
                <p className="text-lg font-bold text-white">
                  ₹{revenueData.reduce((s, m) => s + (m.expenses || 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-surface-500">Expenses</p>
              </div>
            </div>
          </div>
        );
      case 'content':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-3">Content Distribution</p>
              <AdvancedCharts data={movieStats} chartType="pie" height={260} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-3">Subscriber Overview</p>
              <AdvancedCharts data={subscriptionData} chartType="bar" height={260} />
            </div>
          </div>
        );
      case 'overview':
        return (
          <div className="space-y-4">
            <AdvancedCharts data={userStats} chartType="line" title="User Growth" height={200} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Movies', value: movieStats[0]?.count || 0, color: 'from-brand-500 to-purple-600' },
                { label: 'Total Shows', value: movieStats[1]?.count || 0, color: 'from-accent-500 to-pink-600' },
                { label: 'Active Subs', value: subscriptionData[0]?.users || 0, color: 'from-emerald-500 to-teal-600' },
                { label: 'Total Users', value: subscriptionData[1]?.users || 0, color: 'from-blue-500 to-cyan-600' },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl bg-gradient-to-br ${item.color} bg-surface-800 border border-surface-700`}>
                  <p className="text-xl font-bold text-white">{item.value.toLocaleString()}</p>
                  <p className="text-xs text-white/70 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Advanced Analytics</h2>
            <p className="text-xs text-surface-500 mt-0.5">In-depth platform analysis</p>
          </div>
        </div>
        <div className="flex gap-1 mt-4 bg-surface-800 rounded-xl p-0.5 border border-surface-700 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-sm shadow-brand-500/20'
                  : 'text-surface-500 hover:text-white'
                }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;