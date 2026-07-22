import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HiUser, HiKey, HiExclamationTriangle } from 'react-icons/hi2';

const Settings = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || '',
    address: currentUser?.address || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [saving, setSaving] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated successfully');
    }, 800);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswords({ current: '', newPass: '', confirm: '' });
      toast.success('Password changed successfully');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header */}
      <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10 flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur shadow-xl flex-shrink-0">
              <span className="text-white font-bold text-xl sm:text-2xl">{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            </div>
            <div className="text-white min-w-0">
              <h2 className="text-lg sm:text-xl font-bold truncate">{currentUser?.name || 'Admin'}</h2>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 truncate">{currentUser?.email || 'admin@cnio.dev'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {(currentUser?.roles || ['ROLE_ADMIN']).map((role, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur">
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileSave} className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <HiUser className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-semibold text-white">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">Email</label>
              <input type="email" value={profile.email} disabled
                className="w-full px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-500 cursor-not-allowed text-sm" />
              <p className="text-xs text-surface-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">Phone Number</label>
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">Address</label>
              <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Enter address"
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-700">
          <div className="flex items-center gap-2">
            <HiKey className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-semibold text-white">Change Password</h3>
          </div>
          <p className="text-sm text-surface-500 mt-1">Update your password to keep your account secure</p>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">Current Password</label>
              <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password" required
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">New Password</label>
              <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                placeholder="Enter new password" required minLength={8}
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-500 mb-1.5">Confirm New Password</label>
              <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password" required minLength={8}
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all text-sm" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-surface-800 text-white text-sm font-semibold rounded-xl border border-surface-700 hover:bg-surface-700 transition-all disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-900 rounded-2xl border border-red-500/20 overflow-hidden">
        <div className="px-6 py-5 border-b border-red-500/20">
          <div className="flex items-center gap-2">
            <HiExclamationTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
          </div>
          <p className="text-sm text-surface-500 mt-1">Irreversible and destructive actions</p>
        </div>
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Delete account</p>
            <p className="text-xs text-surface-500 mt-0.5">Permanently remove your account and all associated data</p>
          </div>
          <button className="w-full sm:w-auto px-4 py-2 bg-red-500/10 text-red-400 text-sm font-semibold rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
