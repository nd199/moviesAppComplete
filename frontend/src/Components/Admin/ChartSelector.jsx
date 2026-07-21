import { useState } from 'react';
import AdvancedCharts from './AdvancedCharts';

const ChartSelector = ({ data, title }) => {
  const [selectedChart, setSelectedChart] = useState('line');

  const chartTypes = [
    { id: 'line', name: 'Line' },
    { id: 'bar', name: 'Bar' },
    { id: 'area', name: 'Area' },
    { id: 'pie', name: 'Pie' },
    { id: 'multiLine', name: 'Multi' },
  ];

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="flex bg-surface-800 rounded-lg p-0.5 border border-surface-700">
          {chartTypes.map(chart => (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedChart === chart.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-white'
              }`}
            >
              {chart.name}
            </button>
          ))}
        </div>
      </div>
      <AdvancedCharts data={data} chartType={selectedChart} title={title} />
    </div>
  );
};

export default ChartSelector;
