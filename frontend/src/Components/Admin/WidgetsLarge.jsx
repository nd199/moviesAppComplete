import { useState } from 'react';
import { format } from 'timeago.js';

const mockSubscriptions = [
  { id: 1, user: { name: 'John Doe' }, plan: { name: 'Premium', price: 499 }, status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 2, user: { name: 'Jane Smith' }, plan: { name: 'Basic', price: 99 }, status: 'PENDING', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, user: { name: 'Bob Johnson' }, plan: { name: 'Standard', price: 199 }, status: 'CANCELLED', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, user: { name: 'Alice Brown' }, plan: { name: 'Premium', price: 499 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, user: { name: 'Charlie Wilson' }, plan: { name: 'Basic', price: 99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 345600000).toISOString() },
];

const statusStyles = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

const avatarColors = [
  'from-violet-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
];

const WidgetsLarge = () => {
  const [subscriptions] = useState(mockSubscriptions);

  return (
    <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Latest Subscriptions</h3>
            <p className="text-sm text-white/80 mt-0.5">Recent activity on your platform</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {subscriptions.map((sub, idx) => (
          <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-200/60 hover:bg-gray-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center shadow-sm`}>
                <span className="text-white text-xs font-bold">{sub.user?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{sub.user?.name}</p>
                <p className="text-xs text-gray-600">{sub.plan?.name} · {format(sub.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900">₹{sub.plan?.price}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${statusStyles[sub.status]}`}>
                {sub.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetsLarge;
