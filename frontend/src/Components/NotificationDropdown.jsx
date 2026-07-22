import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../redux/notificationRedux';
import { NotificationsNone, DoneAll, Delete, MovieFilter, Payment, Info, Warning } from '@mui/icons-material';

const typeConfig = {
  NEW_CONTENT: { icon: MovieFilter, color: 'text-brand-400', bg: 'bg-brand-500/10', label: 'New Content' },
  SUBSCRIPTION: { icon: Payment, color: 'text-accent-400', bg: 'bg-accent-500/10', label: 'Subscription' },
  SYSTEM: { icon: Info, color: 'text-gold-400', bg: 'bg-gold-500/10', label: 'System' },
  PAYMENT: { icon: Payment, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Payment' },
  EXPIRY: { icon: Warning, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Expiry' },
};

const getTypeConfig = (type) => typeConfig[type] || typeConfig.SYSTEM;

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const NotificationDropdown = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.notification || {});
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={dropdownRef}
        className="absolute top-[calc(100%+8px)] right-0 w-[360px] max-w-[calc(100vw-2rem)] glass-strong rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-sm m-0">Notifications</h3>
          </div>
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="flex items-center gap-1 text-[0.7rem] text-brand-400 hover:text-brand-300 transition-all bg-transparent border-none cursor-pointer"
          >
            <DoneAll sx={{ fontSize: 14 }} />
            Mark all read
          </button>
        </div>

        {/* Notification list */}
        <div className="max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <span className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
              <span className="text-[#5a6380] text-xs">Loading...</span>
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notif) => {
              const config = getTypeConfig(notif.messageType || notif.category);
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-5 py-3.5 border-b border-white/5 transition-all hover:bg-white/5 ${!notif.read ? 'bg-brand-500/5' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon sx={{ fontSize: 16 }} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium m-0 truncate ${!notif.read ? 'text-white' : 'text-[#8892b0]'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />}
                    </div>
                    <p className="text-[0.7rem] text-[#5a6380] m-0 mt-0.5 line-clamp-2">{notif.message}</p>
                    <span className="text-[0.65rem] text-[#3b4560] mt-1 block">{timeAgo(notif.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => dispatch(markAsRead(notif.id))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#5a6380] hover:text-brand-400 hover:bg-brand-500/10 transition-all bg-transparent border-none cursor-pointer"
                        title="Mark as read"
                      >
                        <DoneAll sx={{ fontSize: 14 }} />
                      </button>
                    )}
                    <button
                      onClick={() => dispatch(deleteNotification(notif.id))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#5a6380] hover:text-red-400 hover:bg-red-500/10 transition-all bg-transparent border-none cursor-pointer"
                      title="Delete"
                    >
                      <Delete sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <NotificationsNone sx={{ fontSize: 40, color: '#3b4560' }} />
              <p className="text-[#5a6380] text-sm mt-3 m-0">No notifications yet</p>
              <p className="text-[#3b4560] text-xs mt-1 m-0">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
