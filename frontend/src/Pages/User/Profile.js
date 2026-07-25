import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowBack, CameraAlt, Mail, Phone, LocationOn, Person, Lock, CreditCard, CalendarToday, Shield, Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { uploadToImgBB } from '../../ImgBB';
import { changePassword, updateProfile } from '../../Network/ApiCalls';
import { formatPhoneNumber, getPasswordStrength, validatePasswordForm, validateProfileForm } from '../../Utils/profileValidation';

const PlaceholderImg = 'https://via.placeholder.com/150/111/999?text=U';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.currentUser);
  const navigate = useNavigate();

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // UI state
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [originalValues] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    imageUrl: user?.imageUrl || ''
  });

  const hasProfileChanges = () =>
    name !== originalValues.name ||
    phoneNumber !== originalValues.phoneNumber ||
    address !== originalValues.address ||
    imageUrl !== originalValues.imageUrl;

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const r = new FileReader();
      r.onloadend = () => setImageUrl(r.result);
      r.readAsDataURL(file);
    }
  };

  const handlePhoneChange = e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));

  const userUpdateHandler = async e => {
    e.preventDefault();
    const validation = validateProfileForm({ name, email, phoneNumber, address, imageUrl });
    if (!validation.isValid) {
      setProfileErrors(validation.errors);
      toast.error(Object.values(validation.errors)[0] || 'Please fix the validation errors');
      return;
    }
    setProfileErrors({});
    setIsUpdatingProfile(true);
    try {
      let updatedImageUrl = imageUrl;
      if (avatar) updatedImageUrl = await uploadToImgBB(avatar, setUploadProgress);
      await updateProfile(dispatch, { name, email, phoneNumber, address, imageUrl: updatedImageUrl }, user.id);
      toast.success('Profile updated!');
    } catch (err) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('email already')) toast.error('Email already exists.');
      else if (msg.includes('phone already')) toast.error('Phone number already exists.');
      else toast.error(err.message || 'Profile update failed');
    } finally { setIsUpdatingProfile(false); }
  };

  const passwordChangeHandler = async e => {
    e.preventDefault();
    const validation = validatePasswordForm({
      currentPassword, newPassword, confirmPassword,
      userName: user?.name, userEmail: user?.email, userPhone: user?.phoneNumber
    });
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      toast.error(Object.values(validation.errors)[0] || 'Please fix the validation errors');
      return;
    }
    setPasswordErrors({});
    setIsChangingPassword(true);
    try {
      const result = await changePassword(dispatch, { currentPassword, newPassword, confirmPassword });
      if (result.success) {
        toast.success('Password changed!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('incorrect')) toast.error('Current password is incorrect.');
      else if (msg.includes('personal info')) toast.error('Password must not contain personal information.');
      else toast.error(err.message || 'Password change failed');
    } finally { setIsChangingPassword(false); }
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Member';

  const hasUpper = /[A-Z]/, hasLower = /[a-z]/, hasNum = /\d/, hasSpec = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    <div className="min-h-screen bg-surface-950 pt-20">
      <ToastContainer />

      {/* Back button */}
      <div className="max-w-[800px] mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5a6380] hover:text-white transition-colors bg-transparent border-none cursor-pointer text-sm"
        >
          <ArrowBack fontSize="small" /> Back
        </button>
      </div>

      <div className="max-w-[800px] mx-auto px-6 pb-16">

        {/* ─── Avatar + Identity ─── */}
        <div className="flex flex-col items-center mt-8 mb-10">
          <div className="relative group mb-5">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full opacity-40 blur-md group-hover:opacity-60 transition-opacity" />
            <img
              src={imageUrl || PlaceholderImg}
              alt={name || 'User'}
              className="relative w-28 h-28 rounded-full object-cover border-4 border-surface-950"
              onError={e => { e.target.src = PlaceholderImg; }}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-brand-500/30 z-10"
            >
              <CameraAlt sx={{ fontSize: 16, color: 'white' }} />
            </label>
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h1 className="text-2xl font-bold text-white m-0">{name || 'User'}</h1>
          <p className="text-[#5a6380] text-sm m-0 mt-1">{email}</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-[#8892b0] text-xs font-medium">
              <CalendarToday sx={{ fontSize: 12 }} /> Joined {joinDate}
            </span>
            {user?.isSubscribed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium">
                <CheckCircle sx={{ fontSize: 12 }} /> Subscribed
              </span>
            )}
          </div>
        </div>

        {/* ─── Edit Profile ─── */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Person sx={{ fontSize: 18, color: '#7c3aed' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white m-0">Edit Profile</h2>
              <p className="text-[#5a6380] text-sm m-0">Update your personal information</p>
            </div>
          </div>

          <form onSubmit={userUpdateHandler} className="flex flex-col gap-5">
            {/* Avatar upload row */}
            <div className="flex items-center gap-4 p-4 rounded-xl glass">
              <img src={imageUrl || PlaceholderImg} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
              <div className="flex-1">
                <label htmlFor="form-avatar" className="text-sm text-[#8892b0] hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                  <CameraAlt sx={{ fontSize: 16 }} /> Change photo
                </label>
                <input id="form-avatar" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <p className="text-[0.65rem] text-[#5a6380] m-0 mt-1">JPG, PNG or GIF</p>
              </div>
              {uploadProgress > 0 && (
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0] flex items-center gap-2">
                <Person sx={{ fontSize: 14 }} /> Full Name
              </label>
              <input
                type="text"
                className={`w-full p-3 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${profileErrors.name ? '!border-red-500' : ''}`}
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {profileErrors.name && <span className="text-red-400 text-xs">{profileErrors.name}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0] flex items-center gap-2">
                <Mail sx={{ fontSize: 14 }} /> Email
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none transition-all opacity-50 cursor-not-allowed"
                placeholder="your@email.com"
                value={email}
                disabled
              />
              <p className="text-[0.65rem] text-[#4a5568] m-0">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0] flex items-center gap-2">
                <Phone sx={{ fontSize: 14 }} /> Phone Number
              </label>
              <input
                type="tel"
                className={`w-full p-3 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${profileErrors.phoneNumber ? '!border-red-500' : ''}`}
                placeholder="Enter phone number"
                value={formatPhoneNumber(phoneNumber)}
                onChange={handlePhoneChange}
                maxLength={10}
              />
              {profileErrors.phoneNumber && <span className="text-red-400 text-xs">{profileErrors.phoneNumber}</span>}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0] flex items-center gap-2">
                <LocationOn sx={{ fontSize: 14 }} /> Address
              </label>
              <input
                type="text"
                className={`w-full p-3 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${profileErrors.address ? '!border-red-500' : ''}`}
                placeholder="Enter your address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              {profileErrors.address && <span className="text-red-400 text-xs">{profileErrors.address}</span>}
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile || !hasProfileChanges()}
              className={`w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer mt-2 ${
                isUpdatingProfile || !hasProfileChanges()
                  ? 'bg-white/5 text-[#5a6380] cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {isUpdatingProfile ? 'Saving...' : hasProfileChanges() ? 'Save Changes' : 'No Changes to Save'}
            </button>
          </form>
        </div>

        {/* ─── Change Password ─── */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Lock sx={{ fontSize: 18, color: '#7c3aed' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white m-0">Change Password</h2>
              <p className="text-[#5a6380] text-sm m-0">Keep your account secure</p>
            </div>
          </div>

          <form onSubmit={passwordChangeHandler} className="flex flex-col gap-5">
            {/* Current password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0]">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  className={`w-full p-3 pr-10 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${passwordErrors.currentPassword ? '!border-red-500' : ''}`}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] cursor-pointer hover:text-white transition-colors">
                  {showCurrentPw ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </button>
              </div>
              {passwordErrors.currentPassword && <span className="text-red-400 text-xs">{passwordErrors.currentPassword}</span>}
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0]">New Password</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className={`w-full p-3 pr-10 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${passwordErrors.newPassword ? '!border-red-500' : ''}`}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] cursor-pointer hover:text-white transition-colors">
                  {showNewPw ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </button>
              </div>
              {passwordErrors.newPassword && <span className="text-red-400 text-xs">{passwordErrors.newPassword}</span>}
            </div>

            {/* Strength bar */}
            {newPassword && (
              <div className="flex flex-col gap-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%`, backgroundColor: passwordStrength.color }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
              </div>
            )}

            {/* Requirements */}
            {newPassword && (
              <div className="rounded-xl glass p-4">
                <p className="text-[0.65rem] text-[#5a6380] mb-2 m-0 uppercase tracking-wider font-medium">Requirements</p>
                <ul className="space-y-1.5 list-none p-0 m-0">
                  {[
                    { label: "Uppercase letter (A-Z)", check: hasUpper.test(newPassword) },
                    { label: "Lowercase letter (a-z)", check: hasLower.test(newPassword) },
                    { label: "Number (0-9)", check: hasNum.test(newPassword) },
                    { label: "Special character (!@#$%^&*)", check: hasSpec.test(newPassword) },
                    { label: "8-128 characters", check: newPassword.length >= 8 && newPassword.length <= 128 },
                    { label: "Different from current", check: currentPassword && newPassword && currentPassword !== newPassword },
                    { label: "No personal info", check: !containsPersonalInfo(newPassword, user?.name, user?.email, user?.phoneNumber) },
                  ].map(({ label, check }) => (
                    <li key={label} className="text-xs flex items-center gap-2" style={{ color: check ? '#10b981' : 'rgb(156,163,175)' }}>
                      <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[0.6rem]" style={{ borderColor: check ? '#10b981' : 'rgb(156,163,175)' }}>
                        {check && '✓'}
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8892b0]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className={`w-full p-3 pr-10 rounded-xl glass text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${passwordErrors.confirmPassword ? '!border-red-500' : ''}`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] cursor-pointer hover:text-white transition-colors">
                  {showConfirmPw ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && <span className="text-red-400 text-xs">{passwordErrors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className={`w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer ${
                isChangingPassword
                  ? 'bg-white/5 text-[#5a6380] cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* ─── Subscription ─── */}
        {user?.isSubscribed && (
          <div className="glass-card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <CreditCard sx={{ fontSize: 18, color: '#06b6d4' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white m-0">Subscription</h2>
                <p className="text-[#5a6380] text-sm m-0">Your active plan</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer btn-secondary"
            >
              Manage Subscription
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const containsPersonalInfo = (pw, n, em, ph) => {
  if (!pw) return false;
  const low = pw.toLowerCase();
  if (n) for (const p of n.toLowerCase().split(' ')) if (p.length >= 3 && low.includes(p)) return true;
  if (em) { const local = em.split('@')[0].toLowerCase(); if (local.length >= 3 && low.includes(local)) return true; }
  if (ph) { const d = ph.replace(/\D/g, ''); for (let i = 0; i <= d.length - 3; i++) if (pw.includes(d.substring(i, i + 3))) return true; }
  return false;
};

export default Profile;
