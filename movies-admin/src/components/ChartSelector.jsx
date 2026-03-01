import React, { useState } from 'react';
import AdvancedCharts from './AdvancedCharts';

const ChartSelector = ({ data, title }) => {
  const [selectedChart, setSelectedChart] = useState('line');

  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'area', name: 'Area Chart', icon: '📉' },
    { id: 'pie', name: 'Pie Chart', icon: '🥧' },
    { id: 'multiLine', name: 'Multi-Line', icon: '📈' }
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Chart Type:</span>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-100 text-sm focus:outline-none focus:border-white/20 transition-colors"
          >
            {chartTypes.map(chart => (
              <option key={chart.id} value={chart.id}>
                {chart.icon} {chart.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <AdvancedCharts data={data} chartType={selectedChart} title={title} />
      
      {/* Chart Type Pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {chartTypes.map(chart => (
          <button
            key={chart.id}
            onClick={() => setSelectedChart(chart.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedChart === chart.id
                ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {chart.icon} {chart.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartSelector;
