import { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const StatCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

const Statistics = () => {
  const [stats, setStats] = useState({
    revenue: { current: 0, previous: 0, change: 0 },
    users: { current: 0, previous: 0, change: 0 },
    movies: { current: 0, previous: 0, change: 0 },
    subscriptions: { current: 0, previous: 0, change: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [revenueRes, usersRes, moviesRes, subscriptionsRes] = await Promise.all([
        api.get('/admin/statistics/revenue'),
        api.get('/admin/statistics/users'),
        api.get('/admin/statistics/movies'),
        api.get('/admin/statistics/subscriptions'),
      ]);

      setStats({
        revenue: revenueRes.data,
        users: usersRes.data,
        movies: moviesRes.data,
        subscriptions: subscriptionsRes.data,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Set mock data for demo
      setStats({
        revenue: { current: 12500, previous: 10000, change: 25 },
        users: { current: 1234, previous: 1000, change: 23.4 },
        movies: { current: 567, previous: 500, change: 13.4 },
        subscriptions: { current: 890, previous: 800, change: 11.25 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Revenue"
        value={`$${stats.revenue.current.toLocaleString()}`}
        change={stats.revenue.change}
        icon={() => (
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      />
      <StatCard
        title="Total Users"
        value={stats.users.current.toLocaleString()}
        change={stats.users.change}
        icon={() => (
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      />
      <StatCard
        title="Movies & Shows"
        value={stats.movies.current.toLocaleString()}
        change={stats.movies.change}
        icon={() => (
          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
          </svg>
        )}
      />
      <StatCard
        title="Active Subscriptions"
        value={stats.subscriptions.current.toLocaleString()}
        change={stats.subscriptions.change}
        icon={() => (
          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      />
    </div>
  );
};

export default Statistics;
