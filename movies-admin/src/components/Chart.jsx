import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const Chart = ({ title, data, dataKey, grid }) => {
  return (
    <div 
      className="mx-5 p-5"
      style={{
        boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
        WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
        MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
      }}
    >
      <h3 className="mb-5">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#DE892033" strokeDasharray="10 15" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
