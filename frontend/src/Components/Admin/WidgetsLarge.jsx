import { useEffect, useState } from 'react';
import { adminAPI } from '../../AxiosMethods';

const avatarColors = [
  'from-brand-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
];

const WidgetsLarge = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllUsers()
      .then(res => setUsers((res.data || []).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Users</h3>
            <p className="text-sm text-white/80 mt-0.5">Latest registered users</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-surface-600 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : users.length > 0 ? (
          users.map((user, idx) => (
            <div key={user.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-xs font-bold">{user.name?.charAt(0) || '?'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-surface-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  user.isActive !== false
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  {user.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-surface-500 text-sm py-8">No users found</p>
        )}
      </div>
    </div>
  );
};

export default WidgetsLarge;
