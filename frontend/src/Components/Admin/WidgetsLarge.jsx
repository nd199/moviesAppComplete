import { useEffect, useState } from 'react';
import { adminAPI } from '../../AxiosMethods';

const statusStyles = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  INACTIVE: 'bg-red-50 text-red-700 ring-red-600/20',
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllUsers()
      .then(res => setUsers((res.data || []).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
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
            <div className="w-6 h-6 border-2 border-gray-300 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : users.length > 0 ? (
          users.map((user, idx) => (
            <div key={user.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-200/60 hover:bg-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-xs font-bold">{user.name?.charAt(0) || '?'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${user.isActive !== false ? statusStyles.ACTIVE : statusStyles.INACTIVE}`}>
                  {user.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-8">No users found</p>
        )}
      </div>
    </div>
  );
};

export default WidgetsLarge;
