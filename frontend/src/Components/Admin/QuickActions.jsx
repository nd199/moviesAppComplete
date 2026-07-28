import { Link } from 'react-router-dom';
import { HiFilm, HiTv, HiUserGroup, HiUser, HiChartBar, HiCalendar, HiCurrencyRupee, HiUserMinus } from 'react-icons/hi2';

const actions = [
  { name: 'Add Movie', href: '/admin/movies/new', icon: HiFilm, gradient: 'from-brand-500 to-purple-600', desc: 'Upload a new movie to the platform' },
  { name: 'Add Show', href: '/admin/shows/new', icon: HiTv, gradient: 'from-accent-500 to-pink-600', desc: 'Create a new TV series' },
  { name: 'Add User', href: '/admin/users/new', icon: HiUserGroup, gradient: 'from-emerald-500 to-teal-600', desc: 'Register a new user account' },
  { name: 'Add Admin', href: '/admin/admins/new', icon: HiUser, gradient: 'from-amber-500 to-orange-600', desc: 'Invite a new admin user' },
  { name: 'View Analytics', href: '/admin/dashboard', icon: HiChartBar, gradient: 'from-cyan-500 to-blue-600', desc: 'View platform analytics' },
  { name: 'Manage Subscriptions', href: '/admin/users', icon: HiCurrencyRupee, gradient: 'from-emerald-500 to-green-600', desc: 'View and manage subscriptions' },
];

const QuickActions = () => {
  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700">
        <h3 className="text-base font-semibold text-white">Quick Actions</h3>
        <p className="text-xs text-surface-500 mt-0.5">Common admin tasks</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group relative flex items-start gap-3 p-4 rounded-xl bg-surface-800/60 border border-surface-700/50 hover:border-surface-600 hover:bg-surface-800 transition-all duration-200 no-underline"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{action.name}</p>
                <p className="text-[11px] text-surface-500 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;