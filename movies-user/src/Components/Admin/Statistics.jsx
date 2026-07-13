import { useState } from 'react';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';

const mockStats = {
  revenue: { current: 12500, previous: 10000, change: 25 },
  users: { current: 1234, previous: 1000, change: 23.4 },
  movies: { current: 567, previous: 500, change: 13.4 },
  subscriptions: { current: 890, previous: 800, change: 11.25 },
};

const StatCard = ({ title, value, change, gradient, icon }) => {
  const isPositive = change > 0;
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-4 right-12 w-8 h-8 bg-white/10 rounded-lg rotate-12" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white/80">{title}</span>
          <span className="text-white/60">{icon}</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <div className="flex items-center mt-2">
          {isPositive ? (
            <HiArrowTrendingUp className="h-4 w-4 text-white/90 mr-1" />
          ) : (
            <HiArrowTrendingDown className="h-4 w-4 text-white/90 mr-1" />
          )}
          <span className="text-sm font-semibold text-white/90">{Math.abs(change)}%</span>
          <span className="text-sm text-white/60 ml-1">vs last month</span>
        </div>
      </div>
    </div>
  );
};

const Statistics = () => {
  const [stats] = useState(mockStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Revenue"
        value={`$${(stats.revenue?.current || 0).toLocaleString()}`}
        change={stats.revenue?.change || 0}
        gradient="bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <StatCard
        title="Total Users"
        value={(stats.users?.current || 0).toLocaleString()}
        change={stats.users?.change || 0}
        gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
      />
      <StatCard
        title="Movies & Shows"
        value={(stats.movies?.current || 0).toLocaleString()}
        change={stats.movies?.change || 0}
        gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" /></svg>}
      />
      <StatCard
        title="Active Subscriptions"
        value={(stats.subscriptions?.current || 0).toLocaleString()}
        change={stats.subscriptions?.change || 0}
        gradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
      />
    </div>
  );
};

export default Statistics;
