import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Chart = ({ title, data, dataKey, grid }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: '350px', minWidth: '300px' }} className="flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '350px', minWidth: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(2, 6, 23, 0.92)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
