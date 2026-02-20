import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchUsers, deleteUser } from '../services/adminApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const usersData = await fetchUsers();
        // Filter out admin users
        const filteredUsers = usersData.filter(user => user.roles?.[0] !== 'ROLE_ADMIN');
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserList();
  }, []);

  const deleteUserHandler = async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error('Failed to delete user');
    }
  };

  const defaultUserPicture = [
    "https://picsum.photos/seed/user1/100/100.jpg",
    "https://picsum.photos/seed/user2/100/100.jpg",
  ];
  const defaultSelected =
    defaultUserPicture[Math.floor(Math.random() * defaultUserPicture.length)];

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "imageUrl",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full object-cover mr-2.5"
              src={params.row.imageUrl || defaultSelected}
              alt="User Avatar"
            />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "createdAt", headerName: "Created On", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="flex gap-2">
            <Link to={`/users/edit/${params.row.id}`}>
              <FaEdit 
                className="text-2xl m-0 rounded-lg bg-green-600 p-0.5 text-white cursor-pointer" 
              />
            </Link>
            <FaTrash
              className="bg-red-600 text-2xl rounded-lg p-0.5 text-white cursor-pointer"
              onClick={() => deleteUserHandler(params.row.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-60px)] overflow-hidden">
      <div className="mx-5 my-5 w-full flex justify-end">
        <Link to="/users/new">
          <button 
            className="w-20 border-none p-1 rounded-lg bg-green-600 cursor-pointer text-white text-xl mr-5"
          >
            Create
          </button>
        </Link>
      </div>
      <div className="w-full overflow-scroll">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Created On</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full object-cover mr-2.5"
                      src={user.imageUrl || defaultSelected}
                      alt="User Avatar"
                    />
                    {user.username}
                  </div>
                </td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.address}</td>
                <td className="border p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <Link to={`/users/edit/${user.id}`}>
                      <FaEdit 
                        className="text-2xl m-0 rounded-lg bg-green-600 p-0.5 text-white cursor-pointer" 
                      />
                    </Link>
                    <FaTrash
                      className="bg-red-600 text-2xl rounded-lg p-0.5 text-white cursor-pointer"
                      onClick={() => deleteUserHandler(user.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
