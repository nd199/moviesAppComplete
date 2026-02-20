import React, { useState, useEffect } from 'react';
import { format } from 'timeago.js';
import { fetchOrders } from '../services/adminApi';

const WidgetsLarge = () => {
  const Button = ({ type }) => {
    return <button className={`px-1.5 py-1.5 rounded-lg border-0 ${type}`}>{type}</button>;
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData.slice(0, 5)); // Show latest 5 orders
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return <div className="widgetLarge">Loading...</div>;
  }

  if (error) {
    return <div className="widgetLarge">Error: {error.message}</div>;
  }

  return (
    <div 
      className="flex-2 p-5"
      style={{
        boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
        WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
        MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
      }}
    >
      <h3 className="text-2xl font-semibold">Latest Transactions</h3>
      <table className="w-full" style={{ borderSpacing: '20px' }}>
        <thead>
          <tr>
            <th className="text-left">Customer</th>
            <th className="text-left">Last Transaction</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="flex items-center font-semibold gap-1.5">
                <img
                  src={
                    order.user?.image ||
                    'https://images.unsplash.com/photo-1609741200119-b292937ea2eb?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-contain"
                />
                <span>{order.user?.username}</span>
              </td>
              <td className="font-normal text-gray-700">{format(order.updatedAt)}</td>
              <td className="font-normal text-gray-700">&#8377;{order.amount}</td>
              <td>
                <Button 
                  type={order.status} 
                  className={`${
                    order.status === 'approved' 
                      ? 'bg-green-300 text-green-800' 
                      : order.status === 'declined'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-orange-200 text-orange-800'
                  }`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WidgetsLarge;
