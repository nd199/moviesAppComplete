import { useState, useEffect } from 'react';
import { adminAPI } from '../../AxiosMethods';
import { HiUser, HiEllipsisHorizontal } from 'react-icons/hi2';

const avatarColors = [
  'from-brand-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
];

const UserActivity = ({ user }) => {
  const activityLevel = user.isActive !== false ? Math.floor(Math.random() * 3) + 3 : 1;
  return (
    <div className="flex gap-0.5 items-end h-6">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-sm transition-all duration-300 ${bar <= activityLevel ? 'bg-emerald-400' : 'bg-surface-700'
            }`}
          style={{ height: `${4 + bar * 3}px` }}
        />
      ))}
    </div>
  );
};

const WidgetsLarge = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllUsers()
      .then(res => setUsers((res.data || []).slice(0, 8)))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Users</h3>
            <p className="text-xs text-surface-500 mt-0.5">Latest registered users</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <HiUser className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 bg-surface-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-surface-700 rounded w-2/3 mb-2" />
                  <div className="h-2 bg-surface-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-1 -mx-1">
            {users.map((user, idx) => (
              <div key={user.id || idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-800/80 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center shadow-sm`}>
                      <span className="text-white text-xs font-bold">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-900 ${user.isActive !== false ? 'bg-emerald-400' : 'bg-surface-600'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name || 'Unknown'}</p>
                    <p className="text-xs text-surface-500 truncate">{user.email || ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <UserActivity user={user} />
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${user.isActive !== false
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                    }`}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center text-surface-600 hover:text-surface-400 hover:bg-surface-700 opacity-0 group-hover:opacity-100 transition-all">
                    <HiEllipsisHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-surface-600">
            <HiUser className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetsLarge;