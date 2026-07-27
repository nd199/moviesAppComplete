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

const COLORS = ['#7c3aed', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl shadow-xl shadow-black/30 px-4 py-3">
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-surface-400">{entry.name}:</span>
          <span className="font-semibold text-white">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const EmptyChart = ({ height = 300 }) => (
  <div className="flex items-center justify-center" style={{ width: '100%', height }}>
    <div className="flex flex-col items-center gap-2 text-surface-600">
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <span className="text-sm font-medium">No data available</span>
    </div>
  </div>
);

const AdvancedCharts = ({ data, chartType = 'line', title, height = 300 }) => {
  if (!data || data.length === 0) {
    return <EmptyChart height={height} />;
  }

  // Get all numeric keys except 'name' for dynamic rendering
  const dataKeys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'total');
  if (dataKeys.length === 0) return <EmptyChart height={height} />;

  const axisProps = {
    stroke: '#4b5563',
    fontSize: 12,
    tickLine: false,
    axisLine: false,
    fill: '#6b7280',
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.08)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: '8px' }} />
            {dataKeys.map((key, idx) => (
              <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              {dataKeys.map((key, idx) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: '8px' }} />
            {dataKeys.map((key, idx) => (
              <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={COLORS[idx % COLORS.length]} fill={`url(#gradient-${key})`} strokeWidth={2} />
            ))}
          </AreaChart>
        );
      case 'pie':
        const pieData = data.map(item => ({
          name: item.name,
          value: dataKeys.reduce((sum, k) => sum + (item[k] || 0), 0),
        }));
        return (
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#4b5563' }}
              style={{ fontSize: 11, fill: '#9ca3af' }}>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: '8px' }} />
          </PieChart>
        );
      case 'multiLine':
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: '8px' }} />
            {dataKeys.map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} strokeWidth={2.5} dot={{ fill: COLORS[idx % COLORS.length], r: 4, strokeWidth: 0 }} activeDot={{ r: 6, stroke: COLORS[idx % COLORS.length], strokeWidth: 2, fill: '#1e293b' }} />
            ))}
          </LineChart>
        );
      default:
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af', paddingTop: '8px' }} />
            {dataKeys.map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} strokeWidth={2.5} dot={{ fill: COLORS[idx % COLORS.length], r: 4, strokeWidth: 0 }} activeDot={{ r: 6, stroke: COLORS[idx % COLORS.length], strokeWidth: 2, fill: '#1e293b' }} />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default AdvancedCharts;
