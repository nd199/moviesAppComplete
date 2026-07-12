import { useState } from 'react';
import { format } from 'timeago.js';

const WidgetsLarge = () => {
  const [orders] = useState([]);
  const Button = ({ type }) => (
    <span className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-semibold
      ${type === 'approved' ? 'bg-emerald-500/15 text-emerald-400' : type === 'pending' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
      {type}
    </span>
  );

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-white font-semibold text-sm m-0 mb-4">Transactions</h3>
      {orders.length === 0 ? (
        <p className="text-[#5a6380] text-sm text-center py-6 m-0">No transactions yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map(o => (
            <div key={o._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all">
              <img src={o.user?.image || 'https://picsum.photos/seed/default/80/80.jpg'} alt="" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-white text-sm flex-1">{o.user?.username}</span>
              <span className="text-[#5a6380] text-xs">{format(o.updatedAt)}</span>
              <span className="text-white text-sm font-medium">₹{o.amount}</span>
              <Button type={o.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetsLarge;
