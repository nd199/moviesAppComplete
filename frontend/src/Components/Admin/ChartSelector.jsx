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
    <div className="bg-gray-100 rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="flex bg-gray-200 rounded-lg p-0.5">
          {chartTypes.map(chart => (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedChart === chart.id
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
