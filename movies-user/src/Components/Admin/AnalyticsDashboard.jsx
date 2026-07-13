import { useState, useEffect } from 'react';
import AdvancedCharts from './AdvancedCharts';
import ChartSelector from './ChartSelector';

const AnalyticsDashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [movieStats, setMovieStats] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserStats([
      { name: 'Jan', "Active User": 400, "New Users": 240, "Revenue": 2400 },
      { name: 'Feb', "Active User": 300, "New Users": 139, "Revenue": 2210 },
      { name: 'Mar', "Active User": 200, "New Users": 380, "Revenue": 2290 },
      { name: 'Apr', "Active User": 278, "New Users": 390, "Revenue": 2000 },
      { name: 'May', "Active User": 189, "New Users": 480, "Revenue": 2181 },
      { name: 'Jun', "Active User": 239, "New Users": 380, "Revenue": 2500 },
    ]);
    setRevenueData([
      { name: 'Q1', revenue: 15000, profit: 5000, expenses: 10000 },
      { name: 'Q2', revenue: 18000, profit: 6000, expenses: 12000 },
      { name: 'Q3', revenue: 22000, profit: 8000, expenses: 14000 },
      { name: 'Q4', revenue: 25000, profit: 10000, expenses: 15000 },
    ]);
    setMovieStats([
      { name: 'Action', count: 45, views: 12000 },
      { name: 'Comedy', count: 32, views: 8000 },
      { name: 'Drama', count: 28, views: 9500 },
      { name: 'Horror', count: 15, views: 4500 },
      { name: 'Romance', count: 20, views: 6000 },
    ]);
    setSubscriptionData([
      { name: 'Basic', users: 450, revenue: 4500 },
      { name: 'Standard', users: 320, revenue: 6400 },
      { name: 'Premium', users: 180, revenue: 5400 },
    ]);
    setLoading(false);
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
          <h3 className="text-base font-semibold text-gray-900 mb-4">Movie Genre Distribution</h3>
          <AdvancedCharts data={movieStats} chartType="bar" />
        </div>
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Subscription Plans</h3>
          <AdvancedCharts data={subscriptionData} chartType="pie" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
