import React, { useState, useEffect } from 'react';
import { format } from 'timeago.js';
import { fetchLatestSubscriptions } from '../services/adminApi';

const WidgetsLarge = () => {
  const Button = ({ type }) => {
    const getButtonStyles = () => {
      switch (type) {
        case 'ACTIVE':
          return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 dark:text-emerald-100';
        case 'CANCELLED':
          return 'border-red-500/30 bg-red-500/15 text-red-200 dark:text-red-100';
        case 'PENDING':
          return 'border-amber-500/30 bg-amber-500/15 text-amber-200 dark:text-amber-100';
        default:
          return 'border-white/10 bg-white/5 text-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300';
      }
    };

    return (
      <button className={`px-3 py-1 rounded-full text-xs font-medium border ${getButtonStyles()}`}>
        {type}
      </button>
    );
  };

  const [subscriptions, setSubscriptions] = useState([
    { id: 1, user: { name: 'John Doe', email: 'john@example.com' }, plan: { name: 'Premium', price: 15.99 }, status: 'ACTIVE', createdAt: new Date() },
    { id: 2, user: { name: 'Jane Smith', email: 'jane@example.com' }, plan: { name: 'Basic', price: 9.99 }, status: 'PENDING', createdAt: new Date(Date.now() - 86400000) },
    { id: 3, user: { name: 'Bob Johnson', email: 'bob@example.com' }, plan: { name: 'Premium', price: 15.99 }, status: 'CANCELLED', createdAt: new Date(Date.now() - 172800000) },
    { id: 4, user: { name: 'Alice Brown', email: 'alice@example.com' }, plan: { name: 'Standard', price: 12.99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 259200000) },
    { id: 5, user: { name: 'Charlie Wilson', email: 'charlie@example.com' }, plan: { name: 'Basic', price: 9.99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 345600000) }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setLoading(true);
        const subscriptionsData = await fetchLatestSubscriptions(null);
        setSubscriptions(subscriptionsData.slice(0, 5)); // Show latest 5 subscriptions
      } catch (err) {
        setError('Failed to fetch subscriptions');
        console.error('WidgetsLarge: Error fetching subscriptions:', err);
        // Set dummy data on error
        setSubscriptions([
          { id: 1, user: { name: 'John Doe', email: 'john@example.com' }, plan: { name: 'Premium', price: 15.99 }, status: 'ACTIVE', createdAt: new Date() },
          { id: 2, user: { name: 'Jane Smith', email: 'jane@example.com' }, plan: { name: 'Basic', price: 9.99 }, status: 'PENDING', createdAt: new Date(Date.now() - 86400000) },
          { id: 3, user: { name: 'Bob Johnson', email: 'bob@example.com' }, plan: { name: 'Premium', price: 15.99 }, status: 'CANCELLED', createdAt: new Date(Date.now() - 172800000) },
          { id: 4, user: { name: 'Alice Brown', email: 'alice@example.com' }, plan: { name: 'Standard', price: 12.99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 259200000) },
          { id: 5, user: { name: 'Charlie Wilson', email: 'charlie@example.com' }, plan: { name: 'Basic', price: 9.99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 345600000) }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadSubscriptions();
  }, []);

  if (loading) {
    return <div className="text-slate-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-300">Error: {error.message}</div>;
  }

  return (
    <div className="flex-1 p-5 bg-white/5 dark:bg-slate-800/50 border border-white/10 dark:border-slate-700/50 rounded-lg shadow-lg hover:bg-white/10 dark:hover:bg-slate-700/30 transition-colors">
      <span className="text-2xl font-semibold text-slate-100 dark:text-white">Latest Subscriptions</span>
      <div className="space-y-3">
        {subscriptions.map(subscription => (
          <div key={subscription.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 dark:border-slate-700/50 bg-white/5 dark:bg-slate-700/20 hover:bg-white/10 dark:hover:bg-slate-700/30 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {subscription.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100 dark:text-white">{subscription.user?.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-300">{subscription.plan?.name} • {format(subscription.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-slate-100 dark:text-white">${subscription.plan?.price}</span>
              <Button type={subscription.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetsLarge;
