import React, { useState, useEffect } from 'react';
import AdvancedCharts from './AdvancedCharts';
import ChartSelector from './ChartSelector';
import api from '../services/api';

const AnalyticsDashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [movieStats, setMovieStats] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - replace with real API calls
      const mockUserStats = [
        { name: 'Jan', "Active User": 400, "New Users": 240, "Revenue": 2400 },
        { name: 'Feb', "Active User": 300, "New Users": 139, "Revenue": 2210 },
        { name: 'Mar', "Active User": 200, "New Users": 380, "Revenue": 2290 },
        { name: 'Apr', "Active User": 278, "New Users": 390, "Revenue": 2000 },
        { name: 'May', "Active User": 189, "New Users": 480, "Revenue": 2181 },
        { name: 'Jun', "Active User": 239, "New Users": 380, "Revenue": 2500 },
      ];

      const mockRevenueData = [
        { name: 'Q1', revenue: 15000, profit: 5000, expenses: 10000 },
        { name: 'Q2', revenue: 18000, profit: 6000, expenses: 12000 },
        { name: 'Q3', revenue: 22000, profit: 8000, expenses: 14000 },
        { name: 'Q4', revenue: 25000, profit: 10000, expenses: 15000 },
      ];

      const mockMovieStats = [
        { name: 'Action', count: 45, views: 12000 },
        { name: 'Comedy', count: 32, views: 8000 },
        { name: 'Drama', count: 28, views: 9500 },
        { name: 'Horror', count: 15, views: 4500 },
        { name: 'Romance', count: 20, views: 6000 },
      ];

      const mockSubscriptionData = [
        { name: 'Basic', users: 450, revenue: 4500 },
        { name: 'Standard', users: 320, revenue: 6400 },
        { name: 'Premium', users: 180, revenue: 5400 },
        { name: 'Enterprise', users: 50, revenue: 2500 },
      ];

      setUserStats(mockUserStats);
      setRevenueData(mockRevenueData);
      setMovieStats(mockMovieStats);
      setSubscriptionData(mockSubscriptionData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Analytics */}
      <ChartSelector 
        data={userStats} 
        title="User Analytics" 
      />

      {/* Revenue Analytics */}
      <ChartSelector 
        data={revenueData} 
        title="Revenue Analytics" 
      />

      {/* Movie Genre Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Movie Genre Distribution</h2>
          <AdvancedCharts data={movieStats} chartType="bar" title="Movie Genres" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Subscription Plans</h2>
          <AdvancedCharts data={subscriptionData} chartType="pie" title="Subscriptions" />
        </div>
      </div>

      {/* Combined Analytics */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Combined Analytics Overview</h2>
        <AdvancedCharts data={userStats} chartType="multiLine" title="Overview" />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
