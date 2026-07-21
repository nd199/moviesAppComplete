import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { systemAPI } from '../services/api';
import { HiUsers, HiArrowDownTray } from 'react-icons/hi2';

const roleBadgeColors = {
  ROLE_ADMIN: 'bg-red-50 text-red-700 ring-red-600/20',
  ROLE_SUPPORT: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  ROLE_CONTENT_MANAGER: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  ROLE_SUPER_ADMIN: 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [resending, setResending] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await systemAPI.getAdmins();
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (email) => {
    setResending(email);
    try {
      await systemAPI.resendInvite({ email });
      toast.success('Invite resent');
    } catch (error) {
      toast.error('Failed to resend invite');
    } finally {
      setResending(null);
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Department', 'Status', 'Joined'];
    const rows = filtered.map(a => [
      a.name, a.email, a.department || 'N/A', a.isActive ? 'Active' : 'Inactive',
      a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admins.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = admins.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.department?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = admins.filter(a => a.isActive).length;
  const inactiveCount = admins.filter(a => !a.isActive).length;

  const avatarColors = [
    'from-red-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-yellow-500',
    'from-pink-500 to-rose-500',
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getPrimaryRole = (roles) => {
    if (!roles || roles.length === 0) return null;
    return roles[0]?.name?.replace('ROLE_', '').replace(/_/g, ' ') || null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Administrators</h2>
            <p className="text-gray-400 mt-1">Manage admin accounts and invitations</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
          >
            <HiArrowDownTray className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <HiUsers className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Active</p>
              <p className="text-2xl font-bold text-emerald-700">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Inactive</p>
              <p className="text-2xl font-bold text-red-700">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" />
        </div>

        {/* Admin List */}
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No admins found</div>
          ) : (
            filtered.map((admin, idx) => (
              <div key={admin.id}
                className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => setSelectedAdmin(admin)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
                      <span className="text-white text-sm font-bold">{admin.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 truncate">{admin.name}</p>
                        {admin.roles?.[0] && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                            roleBadgeColors[admin.roles[0].name] || 'bg-gray-50 text-gray-700 ring-gray-600/20'
                          }`}>
                            {getPrimaryRole(admin.roles)}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                          admin.isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                            : 'bg-red-50 text-red-700 ring-red-600/20'
                        }`}>
                          {admin.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">{admin.department || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400">Joined {formatDate(admin.createdAt)}</p>
                    </div>
                    {!admin.isActive && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleResendInvite(admin.email); }}
                        disabled={resending === admin.email}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {resending === admin.email ? 'Sending...' : 'Resend'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAdmin(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${avatarColors[admins.indexOf(selectedAdmin) % avatarColors.length]} rounded-full flex items-center justify-center shadow-md`}>
                    <span className="text-white text-xl font-bold">{selectedAdmin.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedAdmin.name}</h3>
                    <p className="text-sm text-gray-500">{selectedAdmin.email}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      {selectedAdmin.roles?.map(role => (
                        <span key={role.name} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                          roleBadgeColors[role.name] || 'bg-gray-50 text-gray-700 ring-gray-600/20'
                        }`}>
                          {role.name?.replace('ROLE_', '').replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedAdmin(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                  selectedAdmin.isActive
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                    : 'bg-red-50 text-red-700 ring-red-600/20'
                }`}>
                  {selectedAdmin.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3">
                <DetailRow label="Phone" value={selectedAdmin.phoneNumber} />
                <DetailRow label="Address" value={selectedAdmin.address} />
                <DetailRow label="Department" value={selectedAdmin.department} />
                <DetailRow label="Access Level" value={selectedAdmin.accessLevel} />
                <DetailRow label="Email Verified" value={selectedAdmin.isEmailVerified ? 'Yes' : 'No'} />
                <DetailRow label="Joined" value={formatDate(selectedAdmin.createdAt)} />
                <DetailRow label="Last Updated" value={formatDate(selectedAdmin.updatedAt)} />
              </div>

              {!selectedAdmin.isActive && (
                <div className="pt-2">
                  <button
                    onClick={() => { handleResendInvite(selectedAdmin.email); setSelectedAdmin(null); }}
                    disabled={resending === selectedAdmin.email}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {resending === selectedAdmin.email ? 'Sending...' : 'Resend Invitation Email'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">{value || 'N/A'}</span>
  </div>
);

export default AdminsList;
