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

const AdvancedCharts = ({ data, chartType = 'line', title }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: '300px' }} className="flex items-center justify-center">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  // Get all numeric keys except 'name' for dynamic rendering
  const dataKeys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'total');

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    padding: '10px 14px',
    color: '#111827',
    fontSize: '13px',
  };

  const axisProps = {
    stroke: '#6b7280',
    fontSize: 12,
    tickLine: false,
    axisLine: false,
    fill: '#374151',
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#374151', paddingTop: '8px' }} />
            {dataKeys.map((key, idx) => (
              <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            {dataKeys.map((key, idx) => (
              <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={COLORS[idx % COLORS.length]} fill={COLORS[idx % COLORS.length]} fillOpacity={0.2} />
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
              labelLine={false}>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#374151', paddingTop: '8px' }} />
          </PieChart>
        );
      case 'multiLine':
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#374151', paddingTop: '8px' }} />
            {dataKeys.map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} strokeWidth={2.5} dot={{ fill: COLORS[idx % COLORS.length], r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      default:
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            {dataKeys.map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} strokeWidth={2.5} dot={{ fill: COLORS[idx % COLORS.length], r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default AdvancedCharts;
