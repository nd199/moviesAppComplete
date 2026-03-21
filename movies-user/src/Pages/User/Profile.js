import {
  ArrowBack,
  LocationOnOutlined,
  LockOutlined,
  MailOutlined,
  Person2Outlined,
  PhoneOutlined,
  PublishOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadToImgBB } from '../../ImgBB';
import {
  changePassword,
  updateProfile,
  fetchUsers,
} from '../../Network/ApiCalls';
import {
  formatPhoneNumber,
  getPasswordStrength,
  validatePasswordForm,
  validateProfileForm,
} from '../../Utils/profileValidation';
import './Profile.css';

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

  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    imageUrl: user?.imageUrl || '',
  });

  // Check if form has changes
  const hasProfileChanges = () => {
    return (
      name !== originalValues.name ||
      phoneNumber !== originalValues.phoneNumber ||
      address !== originalValues.address ||
      imageUrl !== originalValues.imageUrl
    );
  };

  const userUpdateHandler = async e => {
    e.preventDefault();

    // Validate form
    const formData = { name, email, phoneNumber, address, imageUrl };
    const validation = validateProfileForm(formData);

    if (!validation.isValid) {
      setProfileErrors(validation.errors);

      // Show specific validation error message
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError || 'Please fix the validation errors');
      return;
    }

    setProfileErrors({});
    setIsUpdatingProfile(true);

    try {
      let updatedImageUrl = imageUrl;
      if (avatar) {
        const url = await uploadToImgBB(avatar, setUploadProgress);
        updatedImageUrl = url;
      }

      const result = await updateProfile(
        dispatch,
        {
          name,
          email,
          phoneNumber,
          address,
          imageUrl: updatedImageUrl,
        },
        user.id
      );

      if (result.success) {
        toast.success('Profile updated!');
        fetchUsers(dispatch);
        setOriginalValues({
          name,
          email,
          phoneNumber,
          address,
          imageUrl: updatedImageUrl,
        });
        setShowEditForm(false);
      }
    } catch (err) {
      let errorMessage = 'Profile update failed';

      if (err.message) {
        const errorLower = err.message.toLowerCase();

        if (
          errorLower.includes('email already exists') ||
          errorLower.includes('duplicate email')
        ) {
          errorMessage =
            'Email already exists. Please use a different email address.';
        } else if (
          errorLower.includes('phone already exists') ||
          errorLower.includes('duplicate phone')
        ) {
          errorMessage =
            'Phone number already exists. Please use a different phone number.';
        } else if (
          errorLower.includes('validation') ||
          errorLower.includes('invalid')
        ) {
          errorMessage = 'Please check all fields and try again.';
        } else if (
          errorLower.includes('network') ||
          errorLower.includes('connection')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const passwordChangeHandler = async e => {
    e.preventDefault();

    // Validate password form
    const passwordData = {
      currentPassword,
      newPassword,
      confirmPassword,
      userName: user?.name,
      userEmail: user?.email,
      userPhone: user?.phoneNumber,
    };
    const validation = validatePasswordForm(passwordData);

    if (!validation.isValid) {
      setPasswordErrors(validation.errors);

      // Show specific validation error message
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError || 'Please fix the validation errors');
      return;
    }

    setPasswordErrors({});
    setIsChangingPassword(true);

    try {
      const result = await changePassword(dispatch, passwordData);

      if (result.success) {
        toast.success('Password changed successfully!');
        setShowPasswordForm(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      // Handle different types of errors with specific messages
      let errorMessage = 'Password change failed';

      if (err.message) {
        const errorLower = err.message.toLowerCase();

        if (
          errorLower.includes('current password is incorrect') ||
          errorLower.includes('invalid current password')
        ) {
          errorMessage =
            'Current password is incorrect. Please check and try again.';
        } else if (
          errorLower.includes('password must contain') ||
          errorLower.includes('validation')
        ) {
          errorMessage =
            "Password doesn't meet security requirements. Please check all requirements.";
        } else if (
          errorLower.includes('personal info') ||
          errorLower.includes('name, email, phone')
        ) {
          errorMessage =
            'Password must not contain personal information like your name, email, or phone number.';
        } else if (
          errorLower.includes('too similar') ||
          errorLower.includes('different from current')
        ) {
          errorMessage =
            'New password is too similar to current password. Please choose a more different password.';
        } else if (
          errorLower.includes('network') ||
          errorLower.includes('connection')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle phone number formatting
  const handlePhoneChange = e => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  // Get password strength for UI feedback
  const passwordStrength = getPasswordStrength(newPassword);

  // Helper function to check if password contains personal information
  const containsPersonalInfoCheck = (password, name, email, phone) => {
    if (!password) return false;

    const passwordLower = password.toLowerCase();

    // Check name (split into parts)
    if (name) {
      const nameParts = name.toLowerCase().split(' ');
      for (let part of nameParts) {
        if (part.length >= 3 && passwordLower.includes(part)) {
          return true;
        }
      }
    }

    // Check email (before @)
    if (email) {
      const emailLocal = email.toLowerCase().split('@')[0];
      if (emailLocal.length >= 3 && passwordLower.includes(emailLocal)) {
        return true;
      }
    }

    // Check phone number (any sequence of 3+ digits)
    if (phone) {
      const phoneDigits = phone.replace(/\D/g, '');
      for (let i = 0; i <= phoneDigits.length - 3; i++) {
        const sequence = phoneDigits.substring(i, i + 3);
        if (password.includes(sequence)) {
          return true;
        }
      }
    }

    return false;
  };

  // Regex patterns for password validation (moved outside JSX to avoid parsing issues)
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumbers = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profileContainer">
      <ToastContainer />
      <button className="backButton" onClick={handleBack}>
        <ArrowBack />
        Back
      </button>
      <div className="profileTitleContainer">
        <h1 className="profileTitle">Your Profile</h1>
      </div>
      <div className="profileContentContainer">
        <div className="profileInfo">
          <div className="profileInfoContainer">
            <div className="profileInfoImgContainer">
              <img
                src={
                  imageUrl ||
                  'https://via.placeholder.com/150/1a1a1a/9ca3af?text=U'
                }
                alt="Profile"
                className="profileInfoImg"
                onError={e =>
                  (e.target.src =
                    'https://via.placeholder.com/150/1a1a1a/9ca3af?text=U')
                }
              />
            </div>
            <h3 className="profileInfoName">{name || 'User'}</h3>
            <div className="profileDetails">
              <span className="profileInfoTitle">Account Details</span>
              <div className="profileInfoItem">
                <Person2Outlined />
                <span>{name || 'Not set'}</span>
              </div>
              <div className="profileInfoItem">
                <MailOutlined />
                <span>{email || 'Not set'}</span>
              </div>
              <div className="profileInfoItem">
                <PhoneOutlined />
                <span>{phoneNumber || 'Not set'}</span>
              </div>
              <div className="profileInfoItem">
                <LocationOnOutlined />
                <span>{address || 'Not set'}</span>
              </div>
            </div>
            {!showEditForm && !showPasswordForm && (
              <button
                onClick={() => setShowEditForm(true)}
                className="profileUpdateButton"
                disabled={isUpdatingProfile || isChangingPassword}
              >
                <PublishOutlined style={{ marginRight: '8px' }} />
                Edit Profile
              </button>
            )}
            {!showEditForm && !showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="profileUpdateButton"
                style={{
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                }}
                disabled={isUpdatingProfile || isChangingPassword}
              >
                <LockOutlined style={{ marginRight: '8px' }} />
                Change Password
              </button>
            )}
          </div>
        </div>

        {showEditForm && (
          <div className="profileUpdateOverlay">
            <div className="profileUpdate">
              <button
                onClick={() => setShowEditForm(false)}
                className="editProfileCloseButton"
              >
                ✕
              </button>
              <h2 className="profileUpdateTitle">Edit Profile</h2>
              <p className="profileUpdateSubtitle">
                Update your personal information
              </p>
              <form className="profileUpdateForm" onSubmit={userUpdateHandler}>
                <div className="profileUpdateRight">
                  <div className="profileUpdateUpload">
                    <img
                      src={
                        imageUrl ||
                        'https://via.placeholder.com/150/1a1a1a/9ca3af?text=U'
                      }
                      alt=""
                      className="profileUpdateImg"
                    />
                    <label htmlFor="file" className="profileUpdateLabel">
                      <PublishOutlined /> Upload Photo
                    </label>
                    <input
                      id="file"
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {uploadProgress > 0 && (
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        className="uploadProgress"
                      />
                    )}
                  </div>
                </div>
                <div className="profileUpdateLeft">
                  <div className="profileUpdateItem">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className={`profileUpdateInput ${profileErrors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    {profileErrors.name && (
                      <span className="error-message">
                        {profileErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="profileUpdateItem">
                    <label>Email</label>
                    <input
                      type="email"
                      className={`profileUpdateInput ${profileErrors.email ? 'error' : ''}`}
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled
                    />
                    {profileErrors.email && (
                      <span className="error-message">
                        {profileErrors.email}
                      </span>
                    )}
                  </div>
                  <div className="profileUpdateItem">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className={`profileUpdateInput ${profileErrors.phoneNumber ? 'error' : ''}`}
                      placeholder="Enter phone number"
                      value={formatPhoneNumber(phoneNumber)}
                      onChange={handlePhoneChange}
                      maxLength={10}
                    />
                    {profileErrors.phoneNumber && (
                      <span className="error-message">
                        {profileErrors.phoneNumber}
                      </span>
                    )}
                  </div>
                  <div className="profileUpdateItem">
                    <label>Address</label>
                    <input
                      type="text"
                      className={`profileUpdateInput ${profileErrors.address ? 'error' : ''}`}
                      placeholder="Enter your address"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                    {profileErrors.address && (
                      <span className="error-message">
                        {profileErrors.address}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className={`profileUpdateButton ${isUpdatingProfile ? 'loading' : ''} ${!hasProfileChanges() ? 'disabled' : ''}`}
                  disabled={isUpdatingProfile || !hasProfileChanges()}
                >
                  {isUpdatingProfile
                    ? 'Saving...'
                    : hasProfileChanges()
                      ? 'Save Changes'
                      : 'No Changes to Save'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showPasswordForm && (
          <div className="profileUpdateOverlay">
            <div className="profileUpdate">
              <button
                onClick={() => setShowPasswordForm(false)}
                className="editProfileCloseButton"
              >
                ✕
              </button>
              <h2 className="profileUpdateTitle">Change Password</h2>
              <p className="profileUpdateSubtitle">
                Update your account password
              </p>
              <form
                className="profileUpdateForm"
                onSubmit={passwordChangeHandler}
              >
                <div
                  className="profileUpdateLeft"
                  style={{ gridColumn: '1 / -1' }}
                >
                  <div className="profileUpdateItem">
                    <label>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className={`profileUpdateInput ${passwordErrors.currentPassword ? 'error' : ''}`}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--profile-text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <span className="error-message">
                        {passwordErrors.currentPassword}
                      </span>
                    )}
                  </div>
                  <div className="profileUpdateItem">
                    <label>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className={`profileUpdateInput ${passwordErrors.newPassword ? 'error' : ''}`}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--profile-text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="error-message">
                        {passwordErrors.newPassword}
                      </span>
                    )}
                    {newPassword && (
                      <div className="password-strength-indicator">
                        <div className="strength-bar">
                          <div
                            className="strength-fill"
                            style={{
                              width: `${(passwordStrength.strength / 5) * 100}%`,
                              backgroundColor: passwordStrength.color,
                            }}
                          ></div>
                        </div>
                        <span
                          className="strength-text"
                          style={{ color: passwordStrength.color }}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                    {newPassword && (
                      <div className="password-requirements">
                        <p
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--profile-text-muted)',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Password must contain:
                        </p>
                        <ul>
                          <li
                            style={{
                              color: hasUpperCase.test(newPassword)
                                ? '#10b981'
                                : 'var(--profile-text-muted)',
                            }}
                          >
                            Uppercase letter (A-Z)
                          </li>
                          <li
                            style={{
                              color: hasLowerCase.test(newPassword)
                                ? '#10b981'
                                : 'var(--profile-text-muted)',
                            }}
                          >
                            Lowercase letter (a-z)
                          </li>
                          <li
                            style={{
                              color: hasNumbers.test(newPassword)
                                ? '#10b981'
                                : 'var(--profile-text-muted)',
                            }}
                          >
                            Number (0-9)
                          </li>
                          <li
                            style={{
                              color: hasSpecialChar.test(newPassword)
                                ? '#10b981'
                                : 'var(--profile-text-muted)',
                            }}
                          >
                            Special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                          </li>
                          <li
                            style={{
                              color:
                                newPassword.length >= 8 &&
                                newPassword.length <= 128
                                  ? '#10b981'
                                  : 'var(--profile-text-muted)',
                            }}
                          >
                            8-128 characters
                          </li>
                          <li
                            style={{
                              color:
                                currentPassword &&
                                newPassword &&
                                currentPassword !== newPassword
                                  ? '#10b981'
                                  : 'var(--profile-text-muted)',
                            }}
                          >
                            Different from current password
                          </li>
                          <li
                            style={{
                              color: !containsPersonalInfoCheck(
                                newPassword,
                                user?.name,
                                user?.email,
                                user?.phoneNumber
                              )
                                ? '#10b981'
                                : 'var(--profile-text-muted)',
                            }}
                          >
                            No personal information (name, email, phone)
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="profileUpdateItem">
                    <label>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`profileUpdateInput ${passwordErrors.confirmPassword ? 'error' : ''}`}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--profile-text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <span className="error-message">
                        {passwordErrors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className={`profileUpdateButton ${isChangingPassword ? 'loading' : ''}`}
                  style={{ gridColumn: '1 / -1' }}
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
