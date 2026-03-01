import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';

const AdvancedCharts = ({ data, chartType = 'line', title }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: '350px', minWidth: '300px' }} className="flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  const COLORS = ['#ef4444', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const commonTooltipStyle = {
    backgroundColor: 'rgba(2, 6, 23, 0.92)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#e2e8f0',
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(10px)'
  };

  const commonAxisProps = {
    stroke: '#94a3b8',
    fontSize: 12,
    tickLine: false,
    axisLine: false
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip contentStyle={commonTooltipStyle} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            <Bar dataKey="Active User" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="New Users" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip contentStyle={commonTooltipStyle} />
            <Area 
              type="monotone" 
              dataKey="Active User" 
              stackId="1"
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="New Users" 
              stackId="1"
              stroke="#a855f7" 
              fill="#a855f7" 
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      case 'pie':
        // Transform data for pie chart
        const pieData = data.map(item => ({
          name: item.name,
          value: item["Active User"] || item.total || 0
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={commonTooltipStyle} />
          </PieChart>
        );

      case 'multiLine':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip contentStyle={commonTooltipStyle} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            <Line 
              type="monotone" 
              dataKey="Active User" 
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="New Users" 
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="Revenue" 
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      default: // line chart
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip contentStyle={commonTooltipStyle} />
            <Line 
              type="monotone" 
              dataKey="Active User" 
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: '350px', minWidth: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default AdvancedCharts;
