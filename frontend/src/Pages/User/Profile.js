import { ArrowBack, LocationOnOutlined, LockOutlined, MailOutlined, Person2Outlined, PhoneOutlined, PublishOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadToImgBB } from '../../ImgBB';
import { changePassword, updateProfile, fetchUsers } from '../../Network/ApiCalls';
import { formatPhoneNumber, getPasswordStrength, validatePasswordForm, validateProfileForm } from '../../Utils/profileValidation';

const inputClass = "w-full p-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 transition-all disabled:opacity-50";
const inputErrorClass = `${inputClass} !border-red-500`;
const labelClass = "text-sm font-medium text-[#8892b0] flex items-center gap-2";

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
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
      if (result.success) { toast.success('Profile updated!'); fetchUsers(dispatch); setShowEditForm(false); }
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
      if (result.success) { toast.success('Password changed successfully!'); setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
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

  const PasswordToggle = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#5a6380] cursor-pointer hover:text-white transition-colors">
      {show ? <VisibilityOff /> : <Visibility />}
    </button>
  );

  const PlaceholderImg = 'https://via.placeholder.com/150/111/999?text=U';

  return (
    <div className="min-h-screen bg-surface-950 p-6 pt-24">
      <ToastContainer />
      <div className="max-w-[1000px] mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#5a6380] hover:text-white transition-colors bg-transparent border-none cursor-pointer mb-6 text-sm">
          <ArrowBack fontSize="small" /> Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-8 m-0">Your Profile</h1>

        <div className="grid grid-cols-[350px_1fr] gap-8 max-lg:grid-cols-1">
          {/* Profile Card */}
          <div className="glass rounded-2xl p-8 text-center">
            <img src={imageUrl || PlaceholderImg} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-brand-500 mx-auto mb-4" onError={e => { e.target.src = PlaceholderImg; }} />
            <h3 className="text-xl font-semibold text-white m-0 mb-6">{name || 'User'}</h3>

            <div className="text-left space-y-3">
              <span className="text-xs font-semibold text-[#5a6380] uppercase tracking-wider">Account Details</span>
              {[
                { icon: <Person2Outlined fontSize="small" />, text: name || 'Not set' },
                { icon: <MailOutlined fontSize="small" />, text: email || 'Not set' },
                { icon: <PhoneOutlined fontSize="small" />, text: phoneNumber || 'Not set' },
                { icon: <LocationOnOutlined fontSize="small" />, text: address || 'Not set' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[#8892b0] text-sm py-2 border-b border-white/5 last:border-0">
                  <span className="text-brand-500">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {!showEditForm && !showPasswordForm && (
              <div className="flex flex-col gap-3 mt-6">
                <button onClick={() => setShowEditForm(true)} disabled={isUpdatingProfile || isChangingPassword} className="w-full btn-primary flex items-center justify-center gap-2">
                  <PublishOutlined fontSize="small" /> Edit Profile
                </button>
                <button onClick={() => setShowPasswordForm(true)} disabled={isUpdatingProfile || isChangingPassword} className="w-full py-3 px-6 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <LockOutlined fontSize="small" /> Change Password
                </button>
              </div>
            )}
          </div>

          {/* Edit Profile Form */}
          {showEditForm && (
            <div className="glass rounded-2xl p-8 relative">
              <button onClick={() => setShowEditForm(false)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/15 transition-colors border-none cursor-pointer text-lg">✕</button>
              <h2 className="text-xl font-bold text-white m-0 mb-1">Edit Profile</h2>
              <p className="text-[#5a6380] text-sm mb-6 m-0">Update your personal information</p>
              <form onSubmit={userUpdateHandler} className="flex flex-col gap-5">
                <div className="flex flex-col items-center gap-3 p-4 bg-white/[0.03] rounded-xl">
                  <img src={imageUrl || PlaceholderImg} alt="" className="w-24 h-24 rounded-full object-cover border border-white/20" />
                  <label htmlFor="file" className="flex items-center gap-2 text-sm text-[#8892b0] cursor-pointer hover:text-white transition-colors">
                    <PublishOutlined fontSize="small" /> Upload Photo
                  </label>
                  <input id="file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} className="w-full" />}
                </div>

                {[
                  { label: "Full Name", value: name, onChange: e => setName(e.target.value), error: profileErrors.name, placeholder: "Enter your full name" },
                  { label: "Email", value: email, onChange: e => setEmail(e.target.value), error: profileErrors.email, placeholder: "your@email.com", disabled: true },
                  { label: "Phone", value: formatPhoneNumber(phoneNumber), onChange: handlePhoneChange, error: profileErrors.phoneNumber, placeholder: "Enter phone number", maxLength: 10, type: "tel" },
                  { label: "Address", value: address, onChange: e => setAddress(e.target.value), error: profileErrors.address, placeholder: "Enter your address" },
                ].map(({ label, value, onChange, error, placeholder, disabled, maxLength, type }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className={labelClass}>{label}</label>
                    <input type={type || "text"} className={error ? inputErrorClass : inputClass} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} maxLength={maxLength} />
                    {error && <span className="text-red-400 text-xs">{error}</span>}
                  </div>
                ))}

                <button type="submit" className={`w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer ${isUpdatingProfile || !hasProfileChanges() ? 'bg-white/5 text-[#5a6380] cursor-not-allowed' : 'btn-primary'}`} disabled={isUpdatingProfile || !hasProfileChanges()}>
                  {isUpdatingProfile ? 'Saving...' : hasProfileChanges() ? 'Save Changes' : 'No Changes to Save'}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {showPasswordForm && (
            <div className="glass rounded-2xl p-8 relative">
              <button onClick={() => setShowPasswordForm(false)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/15 transition-colors border-none cursor-pointer text-lg">✕</button>
              <h2 className="text-xl font-bold text-white m-0 mb-1">Change Password</h2>
              <p className="text-[#5a6380] text-sm mb-6 m-0">Update your account password</p>
              <form onSubmit={passwordChangeHandler} className="flex flex-col gap-5">
                {[
                  { label: "Current Password", value: currentPassword, onChange: e => setCurrentPassword(e.target.value), error: passwordErrors.currentPassword, show: showCurrentPassword, toggle: () => setShowCurrentPassword(!showCurrentPassword), placeholder: "Enter current password" },
                  { label: "New Password", value: newPassword, onChange: e => setNewPassword(e.target.value), error: passwordErrors.newPassword, show: showNewPassword, toggle: () => setShowNewPassword(!showNewPassword), placeholder: "Enter new password" },
                  { label: "Confirm New Password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), error: passwordErrors.confirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), placeholder: "Confirm new password" },
                ].map(({ label, value, onChange, error, show, toggle, placeholder }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className={labelClass}>{label}</label>
                    <div className="relative">
                      <input type={show ? 'text' : 'password'} className={error ? inputErrorClass : inputClass} placeholder={placeholder} value={value} onChange={onChange} required />
                      <PasswordToggle show={show} onToggle={toggle} />
                    </div>
                    {error && <span className="text-red-400 text-xs">{error}</span>}
                  </div>
                ))}

                {newPassword && (
                  <div className="flex flex-col gap-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(passwordStrength.strength / 5) * 100}%`, backgroundColor: passwordStrength.color }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                  </div>
                )}

                {newPassword && (
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                    <p className="text-[0.7rem] text-[#5a6380] mb-2 m-0">Password must contain:</p>
                    <ul className="space-y-1 list-none p-0 m-0">
                      {[
                        { label: "Uppercase letter (A-Z)", check: hasUpper.test(newPassword) },
                        { label: "Lowercase letter (a-z)", check: hasLower.test(newPassword) },
                        { label: "Number (0-9)", check: hasNum.test(newPassword) },
                        { label: "Special character (!@#$%^&*)", check: hasSpec.test(newPassword) },
                        { label: "8-128 characters", check: newPassword.length >= 8 && newPassword.length <= 128 },
                        { label: "Different from current password", check: currentPassword && newPassword && currentPassword !== newPassword },
                        { label: "No personal information", check: !containsPersonalInfo(newPassword, user?.name, user?.email, user?.phoneNumber) },
                      ].map(({ label, check }) => (
                        <li key={label} className="text-xs flex items-center gap-2" style={{ color: check ? '#10b981' : 'rgb(156,163,175)' }}>
                          <span>{check ? '✓' : '○'}</span> {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button type="submit" className={`w-full py-3 rounded-xl font-semibold transition-all border-none cursor-pointer ${isChangingPassword ? 'bg-white/5 text-[#5a6380] cursor-not-allowed' : 'btn-primary'}`} disabled={isChangingPassword}>
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
