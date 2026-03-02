import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../services/adminApi';

const WidgetsSmall = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultUserPicture = [
    'https://picsum.photos/seed/user1/100/100.jpg',
    'https://picsum.photos/seed/user2/100/100.jpg',
  ];
  const defaultSelected =
    defaultUserPicture[Math.floor(Math.random() * defaultUserPicture.length)];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers(null);
        setUsers(usersData);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div
      className="flex-1 p-5 mr-5 bg-white/5 dark:bg-slate-800/50 border border-white/10 dark:border-slate-700/50 rounded-lg shadow-lg hover:bg-white/10 dark:hover:bg-slate-700/30 transition-colors"
    >
      <span className="text-2xl font-semibold text-slate-100 dark:text-white">Newly Joined Members</span>
      {loading ? (
        <div className="text-center text-red-400 dark:text-red-300 mt-5">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 dark:text-red-300 mt-5">
          <p>{error}</p>
        </div>
      ) : (
        users && users.filter(user => user.roles?.[0] !== 'ROLE_ADMIN').length > 0 ? (
          <ul className="p-0 m-0 list-none">
            {users
              ?.filter(user => user.roles?.[0] !== 'ROLE_ADMIN')
              .slice(0, 5)
              .map((user, index) => (
                <li key={user.id || index} className="flex items-center justify-between my-5 mx-0">
                  <img
                    src={user?.imageUrl || defaultSelected}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col ml-4">
                    <span className="font-semibold text-slate-100 dark:text-white">
                      {user.name || 'No Name'}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-300">
                      {user.email || 'No Email'}
                    </span>
                  </div>
                  <Link to={`/users/edit/${user.id}`}>
                    <button className="border-none p-2 rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors">
                      <FaEye className="text-base" />
                      <span className="ml-2">View</span>
                    </button>
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <div className="text-center text-red-500 mt-5">
            <p>No Users Found</p>
          </div>
        )
      )}
    </div>
  );
};

export default WidgetsSmall;
