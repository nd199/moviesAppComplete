import { Link } from 'react-router-dom';
import { HiFilm, HiTv, HiUserGroup, HiUser } from 'react-icons/hi2';

const actions = [
  { name: 'Add Movie', href: '/admin/movies/new', icon: HiFilm, color: 'from-brand-600 to-brand-700' },
  { name: 'Add Show', href: '/admin/shows/new', icon: HiTv, color: 'from-accent-600 to-accent-700' },
  { name: 'Add User', href: '/admin/users/new', icon: HiUserGroup, color: 'from-emerald-600 to-teal-600' },
  { name: 'Add Admin', href: '/admin/admins/new', icon: HiUser, color: 'from-amber-600 to-orange-600' },
];

const QuickActions = () => {
  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 p-5">
      <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-800 border border-surface-700 hover:border-surface-600 transition-all duration-200 no-underline group"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-surface-500 group-hover:text-white transition-colors">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
