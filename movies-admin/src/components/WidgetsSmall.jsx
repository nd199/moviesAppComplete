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
      className="flex-1 p-5 mr-5"
      style={{
        boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
        WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
        MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
      }}
    >
      <span className="text-2xl font-semibold">Newly Joined Members</span>
      {loading ? (
        <div className="text-center text-red-500 mt-5">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-5">
          <p>{error}</p>
        </div>
      ) : (
        <ul className="m-0 p-0">
          {users?.length > 0 ? (
            users
              ?.filter(user => user.roles?.[0] !== 'ROLE_ADMIN')
              .map(user => (
                <li className="flex items-center justify-between my-5" key={user.id}>
                  <img
                    src={user?.imageUrl || defaultSelected}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name || 'No Name'}</span>
                    <span className="font-light text-xs text-slate-400">
                      {user.email || 'No Email'}
                    </span>
                  </div>
                  <button 
                    className="flex items-center border-none rounded-lg px-2.5 py-1.5 cursor-pointer gap-2"
                    style={{
                      backgroundColor: '#d3901d3f',
                      color: 'brown'
                    }}
                  >
                    <FaEye className="text-base" />
                    <Link to={`/users/edit/${user.id}`} style={{ color: '#8b5cf6' }}>
                      View
                    </Link>
                  </button>
                </li>
              ))
          ) : (
            <div className="text-center text-red-500 mt-5">
              <p>No Users Found</p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default WidgetsSmall;
