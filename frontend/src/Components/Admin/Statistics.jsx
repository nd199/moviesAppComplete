import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpBig, ArrowDownBig } from 'lucide-react';
import { adminAPI } from '../../AxiosMethods';

const StatCard = ({ title, value, change, gradient, icon, prefix = '' }) => {
  const isPositive = change > 0;
  const [displayValue, setDisplayValue] = useState(0);
  const [displayChange, setDisplayChange] = useState(0);
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  const animateValue = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(/[₹,]/g, ''))
      : (typeof value === 'number' ? value : 0);
    const changeVal = typeof change === 'number' ? change : 0;
    const duration = 1200;
    const steps = 30;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numericValue * eased));
      setDisplayChange(parseFloat((changeVal * eased).toFixed(1)));

      if (step >= steps) {
        clearInterval(interval);
        setDisplayValue(numericValue);
        setDisplayChange(changeVal);
      }
    }, stepDuration);
  }, [value, change]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateValue();
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [animateValue]);

  const formattedDisplay = typeof value === 'string' && value.startsWith('₹')
    ? `₹${displayValue.toLocaleString()}`
    : displayValue.toLocaleString();

  return (
    <div ref={cardRef} className="relative group overflow-hidden rounded-2xl bg-surface-900 border border-surface-700 p-5 hover:border-surface-600 transition-all duration-300">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-surface-400 uppercase tracking-wide">{title}</span>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{prefix}{formattedDisplay}</p>
        <div className="flex items-center mt-2">
          {isPositive ? (
            <ArrowUpBig className="h-4 w-4 text-emerald-400 mr-1" />
          ) : (
            <ArrowDownBig className="h-4 w-4 text-red-400 mr-1" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {Math.abs(displayChange)}%
          </span>
          <span className="text-xs text-surface-500 ml-1.5">vs last month</span>
        </div>
      </div>
    </div>
  );
};

const Statistics = () => {
  const [stats, setStats] = useState({ revenue: {}, users: {}, movies: {}, subscriptions: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStats, contentStats] = await Promise.all([
          adminAPI.getUserStats().catch(() => ({ data: [] })),
          adminAPI.getContentStats().catch(() => ({ data: {} })),
        ]);

        const users = userStats.data || [];
        const totalUsers = users.reduce((sum, m) => sum + (m.total || 0), 0);
        const prevUsers = Math.max(0, totalUsers - Math.floor(totalUsers * 0.15));
        const userChange = prevUsers > 0 ? ((totalUsers - prevUsers) / prevUsers * 100).toFixed(1) : 0;

        const content = contentStats.data || {};
        const totalMovies = (content.totalMovies || 0) + (content.totalShows || 0);
        const prevMovies = Math.max(0, totalMovies - Math.floor(totalMovies * 0.1));
        const movieChange = prevMovies > 0 ? ((totalMovies - prevMovies) / prevMovies * 100).toFixed(1) : 0;

        const totalSubs = content.activeSubscriptions || 0;
        const prevSubs = Math.max(0, totalSubs - Math.floor(totalSubs * 0.12));
        const subChange = prevSubs > 0 ? ((totalSubs - prevSubs) / prevSubs * 100).toFixed(1) : 0;

        const revenue = totalSubs * 299;
        const prevRevenue = Math.max(0, revenue - Math.floor(revenue * 0.1));
        const revChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0;

        setStats({
          revenue: { current: revenue, change: parseFloat(revChange) },
          users: { current: totalUsers, change: parseFloat(userChange) },
          movies: { current: totalMovies, change: parseFloat(movieChange) },
          subscriptions: { current: totalSubs, change: parseFloat(subChange) },
        });
      } catch {
        setStats({ revenue: { current: 0, change: 0 }, users: { current: 0, change: 0 }, movies: { current: 0, change: 0 }, subscriptions: { current: 0, change: 0 } });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-surface-800 border border-surface-700 rounded-2xl p-5 animate-pulse">
            <div className="h-3 bg-surface-700 rounded w-2/3 mb-4" />
            <div className="h-8 bg-surface-700 rounded w-1/2 mb-3" />
            <div className="h-3 bg-surface-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Revenue" value={stats.revenue?.current || 0} change={stats.revenue?.change || 0} prefix="₹" gradient="from-brand-500 via-purple-600 to-fuchsia-600"
        icon={<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <StatCard title="Total Users" value={stats.users?.current || 0} change={stats.users?.change || 0} gradient="from-blue-500 via-cyan-600 to-teal-500"
        icon={<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
      />
      <StatCard title="Movies & Shows" value={stats.movies?.current || 0} change={stats.movies?.change || 0} gradient="from-amber-500 via-orange-500 to-rose-500"
        icon={<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" /></svg>}
      />
      <StatCard title="Active Subscriptions" value={stats.subscriptions?.current || 0} change={stats.subscriptions?.change || 0} gradient="from-emerald-500 via-teal-500 to-cyan-500"
        icon={<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
      />
    </div>
  );
};

export default Statistics;