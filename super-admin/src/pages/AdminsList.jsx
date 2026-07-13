import { useState, useEffect } from 'react';
import { systemAPI } from '../services/api';

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await systemAPI.getAdmins();
        setAdmins(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const filtered = admins.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const avatarColors = [
    'from-red-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-yellow-500',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Administrators</h2>
            <p className="text-gray-400 mt-1">{admins.length} admin accounts in the system</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins..."
            className="w-full px-4 py-2.5 bg-gray-200/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" />
        </div>

        <div className="divide-y divide-gray-200">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No admins found</div>
          ) : (
            filtered.map((admin, idx) => (
              <div key={admin.id} className="flex items-center justify-between p-4 hover:bg-gray-200/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center shadow-sm`}>
                    <span className="text-white text-xs font-bold">{admin.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                    <p className="text-xs text-gray-600">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{admin.phoneNumber || 'N/A'}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${
                    admin.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'
                  }`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsList;
