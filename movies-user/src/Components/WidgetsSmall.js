import { useEffect, useState } from 'react';
import { VisibilityOutlined } from '@mui/icons-material';
import { userRequest } from '../AxiosMethods';
import { Link } from 'react-router-dom';
import GlobalLoader from './GlobalLoader';

const WidgetsSmall = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userRequest().get('/customers?new=true')
      .then(r => setUsers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GlobalLoader open message="Loading members..." />;

  return (
    <div className="glass rounded-2xl p-5">
      <span className="text-white font-semibold text-sm block mb-4">New Members</span>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {users.filter(u => u.roles?.[0] !== 'ROLE_ADMIN').map(user => (
          <li key={user.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all">
            <img src={user?.imageUrl || 'https://picsum.photos/seed/user/80/80.jpg'} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white text-sm font-medium truncate">{user.username}</span>
              <span className="text-[#5a6380] text-xs truncate">{user.name || ''}</span>
            </div>
            <Link to={'/User/' + user.id} className="text-brand-300 no-underline hover:text-brand-200 transition-colors">
              <VisibilityOutlined sx={{ fontSize: 16 }} />
            </Link>
          </li>
        ))}
        {!users.length && <p className="text-[#5a6380] text-sm text-center py-4 m-0">No Users Found</p>}
      </ul>
    </div>
  );
};

export default WidgetsSmall;
