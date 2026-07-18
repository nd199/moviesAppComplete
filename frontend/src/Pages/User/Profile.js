import { ArrowBack, CameraAlt, Lock, Mail, Phone, LocationOn, Person, Edit, Shield, CreditCard, CalendarToday, Visibility, VisibilityOff } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadToImgBB } from '../../ImgBB';
import { changePassword, updateProfile, fetchUsers } from '../../Network/ApiCalls';
import { formatPhoneNumber, getPasswordStrength, validatePasswordForm, validateProfileForm } from '../../Utils/profileValidation';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.currentUser);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [originalValues] = useState({ name: user?.name || '', phoneNumber: user?.phoneNumber || '', address: user?.address || '', imageUrl: user?.imageUrl || '' });

  const hasProfileChanges = () => name !== originalValues.name || phoneNumber !== originalValues.phoneNumber || address !== originalValues.address || imageUrl !== originalValues.imageUrl;

  const userUpdateHandler = async e => {
    e.preventDefault();
    const validation = validateProfileForm({ name, email, phoneNumber, address, imageUrl });
    if (!validation.isValid) { setProfileErrors(validation.errors); toast.error(Object.values(validation.errors)[0] || 'Please fix the validation errors'); return; }
    setProfileErrors({});
    setIsUpdatingProfile(true);
    try {
      let updatedImageUrl = imageUrl;
      if (avatar) updatedImageUrl = await uploadToImgBB(avatar, setUploadProgress);
      const result = await updateProfile(dispatch, { name, email, phoneNumber, address, imageUrl: updatedImageUrl }, user.id);
      if (result.success) { toast.success('Profile updated!'); fetchUsers(dispatch); }
    } catch (err) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('email already')) toast.error('Email already exists.');
      else if (msg.includes('phone already')) toast.error('Phone number already exists.');
      else toast.error(err.message || 'Profile update failed');
    } finally { setIsUpdatingProfile(false); }
  };

  const passwordChangeHandler = async e => {
    e.preventDefault();
    const validation = validatePasswordForm({ currentPassword, newPassword, confirmPassword, userName: user?.name, userEmail: user?.email, userPhone: user?.phoneNumber });
    if (!validation.isValid) { setPasswordErrors(validation.errors); toast.error(Object.values(validation.errors)[0] || 'Please fix the validation errors'); return; }
    setPasswordErrors({});
    setIsChangingPassword(true);
    try {
      const result = await changePassword(dispatch, { currentPassword, newPassword, confirmPassword });
      if (result.success) { toast.success('Password changed successfully!'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
    } catch (err) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('incorrect')) toast.error('Current password is incorrect.');
      else if (msg.includes('personal info')) toast.error('Password must not contain personal information.');
      else toast.error(err.message || 'Password change failed');
    } finally { setIsChangingPassword(false); }
  };

  const handlePhoneChange = e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
  const passwordStrength = getPasswordStrength(newPassword);
  const containsPersonalInfo = (pw, n, em, ph) => {
    if (!pw) return false;
    const low = pw.toLowerCase();
    if (n) for (const p of n.toLowerCase().split(' ')) if (p.length >= 3 && low.includes(p)) return true;
    if (em) { const local = em.split('@')[0].toLowerCase(); if (local.length >= 3 && low.includes(local)) return true; }
    if (ph) { const d = ph.replace(/\D/g, ''); for (let i = 0; i <= d.length - 3; i++) if (pw.includes(d.substring(i, i + 3))) return true; }
    return false;
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); const r = new FileReader(); r.onloadend = () => setImageUrl(r.result); r.readAsDataURL(file); }
  };

  const hasUpper = /[A-Z]/, hasLower = /[a-z]/, hasNum = /\d/, hasSpec = /[!@#$%^&*(),.?":{}|<>]/;

  const PlaceholderImg = 'https://via.placeholder.com/150/111/999?text=U';
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Member';

  return (
    <div className="min-h-screen bg-surface-950 pt-20">
      <ToastContainer />

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-surface-950 to-accent-500/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)' }} />

        <div className="relative max-w-[1000px] mx-auto px-6 py-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#5a6380] hover:text-white transition-colors bg-transparent border-none cursor-pointer mb-8 text-sm">
            <ArrowBack fontSize="small" /> Back
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
              <img
                src={imageUrl || PlaceholderImg}
                alt="Profile"
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-surface-950"
                onError={e => { e.target.src = PlaceholderImg; }}
              />
              <label htmlFor="hero-file" className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-brand-500/30">
                <CameraAlt sx={{ fontSize: 16, color: 'white' }} />
              </label>
              <input id="hero-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Name & Meta */}
            <div className="text-center sm:text-left pb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white m-0">{name || 'User'}</h1>
              <p className="text-[#5a6380] text-sm m-0 mt-1 flex items-center gap-2 justify-center sm:justify-start">
                <Mail sx={{ fontSize: 14 }} /> {email || 'No email'}
              </p>
              <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium">
                  <CalendarToday sx={{ fontSize: 12 }} /> {joinDate}
                </span>
                {user?.isSubscribed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium">
                    <CreditCard sx={{ fontSize: 12 }} /> Subscribed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="flex gap-1 border-b border-white/5 -mb-px">
          {[
            { id: 'profile', label: 'Profile', icon: Person },
            { id: 'security', label: 'Security', icon: Shield },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all bg-transparent cursor-pointer ${
                activeTab === id
                  ? 'text-white border-brand-500'
                  : 'text-[#5a6380] border-transparent hover:text-[#8892b0]'
              }`}
            >
              <Icon sx={{ fontSize: 18 }} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-8">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
            {/* Left: Info Cards */}
            <div className="space-y-4">
              {/* Personal Info */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                <h3 className="text-sm font-semibold text-[#5a6380] uppercase tracking-wider m-0 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: Person, label: 'Full Name', value: name || 'Not set' },
                    { icon: Mail, label: 'Email', value: email || 'Not set' },
                    { icon: Phone, label: 'Phone', value: phoneNumber ? formatPhoneNumber(phoneNumber) : 'Not set' },
                    { icon: LocationOn, label: 'Address', value: address || 'Not set' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon sx={{ fontSize: 16, color: '#7c3aed' }} />
                      </div>
                      <div>
                        <p className="text-[0.65rem] text-[#5a6380] uppercase tracking-wider m-0">{label}</p>
                        <p className="text-white text-sm m-0 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                <h3 className="text-sm font-semibold text-[#5a6380] uppercase tracking-wider m-0 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('security')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[#8892b0] hover:text-white transition-all text-sm cursor-pointer"
                  >
                    <Lock sx={{ fontSize: 16 }} /> Change Password
                  </button>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[#8892b0] hover:text-white transition-all text-sm cursor-pointer"
                  >
                    <CreditCard sx={{ fontSize: 16 }} /> Manage Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Edit Form */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
              <h3 className="text-lg font-bold text-white m-0 mb-1">Edit Profile</h3>
              <p className="text-[#5a6380] text-sm m-0 mb-6">Update your personal information</p>

              <form onSubmit={userUpdateHandler} className="flex flex-col gap-5">
                {/* Avatar Upload */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <img src={imageUrl || PlaceholderImg} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                  <div>
                    <label htmlFor="form-file" className="text-sm text-[#8892b0] hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                      <CameraAlt sx={{ fontSize: 16 }} /> Change photo
                    </label>
                    <input id="form-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <p className="text-[0.65rem] text-[#5a6380] m-0 mt-1">JPG, PNG or GIF</p>
                  </div>
                  {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} className="flex-1 ml-4" />}
                </div>

                {/* Form Fields */}
                {[
                  { label: "Full Name", value: name, onChange: e => setName(e.target.value), error: profileErrors.name, placeholder: "Enter your full name", icon: Person },
                  { label: "Email", value: email, onChange: e => setEmail(e.target.value), error: profileErrors.email, placeholder: "your@email.com", icon: Mail, disabled: true },
                  { label: "Phone", value: formatPhoneNumber(phoneNumber), onChange: handlePhoneChange, error: profileErrors.phoneNumber, placeholder: "Enter phone number", icon: Phone, maxLength: 10, type: "tel" },
                  { label: "Address", value: address, onChange: e => setAddress(e.target.value), error: profileErrors.address, placeholder: "Enter your address", icon: LocationOn },
                ].map(({ label, value, onChange, error, placeholder, disabled, maxLength, type, icon: FieldIcon }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#8892b0] flex items-center gap-2">
                      <FieldIcon sx={{ fontSize: 14 }} /> {label}
                    </label>
                    <input
                      type={type || "text"}
                      className={`w-full p-3 rounded-xl bg-white/[0.06] border text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all disabled:opacity-50 ${error ? '!border-red-500' : 'border-white/10'}`}
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      disabled={disabled}
                      maxLength={maxLength}
                    />
                    {error && <span className="text-red-400 text-xs">{error}</span>}
                  </div>
                ))}

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer mt-2 ${
                    isUpdatingProfile || !hasProfileChanges()
                      ? 'bg-white/5 text-[#5a6380] cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:shadow-lg hover:shadow-brand-500/25'
                  }`}
                  disabled={isUpdatingProfile || !hasProfileChanges()}
                >
                  {isUpdatingProfile ? 'Saving...' : hasProfileChanges() ? 'Save Changes' : 'No Changes to Save'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-[520px]">
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Lock sx={{ fontSize: 18, color: '#7c3aed' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white m-0">Change Password</h3>
                  <p className="text-[#5a6380] text-sm m-0">Update your account password</p>
                </div>
              </div>

              <form onSubmit={passwordChangeHandler} className="flex flex-col gap-5">
                {[
                  { label: "Current Password", value: currentPassword, onChange: e => setCurrentPassword(e.target.value), error: passwordErrors.currentPassword, show: showCurrentPassword, toggle: () => setShowCurrentPassword(!showCurrentPassword), placeholder: "Enter current password" },
                  { label: "New Password", value: newPassword, onChange: e => setNewPassword(e.target.value), error: passwordErrors.newPassword, show: showNewPassword, toggle: () => setShowNewPassword(!showNewPassword), placeholder: "Enter new password" },
                  { label: "Confirm New Password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), error: passwordErrors.confirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), placeholder: "Confirm new password" },
                ].map(({ label, value, onChange, error, show, toggle, placeholder }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#8892b0]">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? 'text' : 'password'}
                        className={`w-full p-3 pr-10 rounded-xl bg-white/[0.06] border text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all ${error ? '!border-red-500' : 'border-white/10'}`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required
                      />
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] cursor-pointer hover:text-white transition-colors">
                        {show ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </button>
                    </div>
                    {error && <span className="text-red-400 text-xs">{error}</span>}
                  </div>
                ))}

                {/* Strength Bar */}
                {newPassword && (
                  <div className="flex flex-col gap-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(passwordStrength.strength / 5) * 100}%`, backgroundColor: passwordStrength.color }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                  </div>
                )}

                {/* Requirements */}
                {newPassword && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
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

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer ${
                    isChangingPassword
                      ? 'bg-white/5 text-[#5a6380] cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:shadow-lg hover:shadow-brand-500/25'
                  }`}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
