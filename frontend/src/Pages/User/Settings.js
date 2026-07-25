import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowBack, Notifications, Settings as SettingsIcon, Close, Logout } from "@mui/icons-material";
import { performLogout } from "../../Utils/logout";
import api from "../../AxiosMethods";
import { logout } from "../../redux/userSlice";
import { persistor } from "../../redux/store";
import { clearAuth } from "../../authStore";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('settings_notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('settings_darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('settings_language') || "en";
  });

  const handleNotifications = (val) => {
    setNotifications(val);
    localStorage.setItem('settings_notifications', JSON.stringify(val));
  };

  const handleDarkMode = (val) => {
    setDarkMode(val);
    localStorage.setItem('settings_darkMode', JSON.stringify(val));
  };

  const handleLanguage = (val) => {
    setLanguage(val);
    localStorage.setItem('settings_language', val);
  };

  const handleLogout = async () => {
    await performLogout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      await api.delete(`/customers/${currentUser.id}`);
      clearAuth();
      dispatch(logout());
      persistor.purge();
      navigate("/login");
    } catch {
      await performLogout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 pt-20">
      <div className="max-w-[600px] mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#5a6380] hover:text-white transition-colors bg-transparent border-none cursor-pointer mb-6 text-sm">
          <ArrowBack fontSize="small" /> Back
        </button>

        <h1 className="text-2xl font-bold text-white m-0 mb-8">Settings</h1>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Notifications sx={{ fontSize: 18, color: '#7c3aed' }} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold m-0">Notifications</h3>
                  <p className="text-[#5a6380] text-xs m-0">Email notifications for new content</p>
                </div>
              </div>
              <button
                onClick={() => handleNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border-none ${notifications ? 'bg-brand-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <SettingsIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold m-0">Dark Mode</h3>
                  <p className="text-[#5a6380] text-xs m-0">Use dark theme throughout the app</p>
                </div>
              </div>
              <button
                onClick={() => handleDarkMode(!darkMode)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border-none ${darkMode ? 'bg-brand-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Notifications sx={{ fontSize: 18, color: '#7c3aed' }} />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold m-0">Language</h3>
                <p className="text-[#5a6380] text-xs m-0">Select your preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={e => handleLanguage(e.target.value)}
              className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 transition-all"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl bg-red-500/5 border border-red-500/10 p-6">
            <h3 className="text-red-400 text-sm font-semibold m-0 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button onClick={handleDeleteAccount}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-[#8892b0] hover:text-red-400 transition-all text-sm cursor-pointer">
                <Close sx={{ fontSize: 16 }} /> Delete Account
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-[#8892b0] hover:text-red-400 transition-all text-sm cursor-pointer"
              >
                <Logout sx={{ fontSize: 16 }} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
