import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { systemAPI } from '../services/api';

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
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (email) => {
    setResending(email);
    try {
      await systemAPI.resendInvite({ email });
      toast.success(`Invite resent to ${email}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend invite');
    } finally {
      setResending(null);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Administrators</h2>
          <p className="text-gray-400 mt-1">Manage admin accounts and invitations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{admins.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Inactive</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{inactiveCount}</p>
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{admin.name}</p>
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
                        {resending === admin.email ? 'Sending...' : 'Resend Invite'}
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
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${avatarColors[admins.indexOf(selectedAdmin) % avatarColors.length]} rounded-full flex items-center justify-center shadow-md`}>
                    <span className="text-white text-xl font-bold">{selectedAdmin.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedAdmin.name}</h3>
                    <p className="text-sm text-gray-500">{selectedAdmin.email}</p>
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

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Status */}
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

              {/* Details */}
              <div className="space-y-3">
                <DetailRow label="Phone" value={selectedAdmin.phoneNumber} />
                <DetailRow label="Address" value={selectedAdmin.address} />
                <DetailRow label="Department" value={selectedAdmin.department} />
                <DetailRow label="Access Level" value={selectedAdmin.accessLevel} />
                <DetailRow label="Email Verified" value={selectedAdmin.isEmailVerified ? 'Yes' : 'No'} />
                <DetailRow label="Roles" value={selectedAdmin.roles?.map(r => r.name?.replace('ROLE_', '')).join(', ') || 'N/A'} />
                <DetailRow label="Joined" value={formatDate(selectedAdmin.createdAt)} />
                <DetailRow label="Last Updated" value={formatDate(selectedAdmin.updatedAt)} />
              </div>

              {/* Actions */}
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
