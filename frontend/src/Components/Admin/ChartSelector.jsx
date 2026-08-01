import { useState } from 'react';
import AdvancedCharts from './AdvancedCharts';
import { BarChart3, PieChart, BarChart4 } from 'lucide-react';

const chartTypes = [
  { id: 'line', name: 'Line', icon: BarChart3 },
  { id: 'bar', name: 'Bar', icon: BarChart4 },
  { id: 'area', name: 'Area', icon: BarChart3 },
  { id: 'pie', name: 'Pie', icon: PieChart },
  { id: 'column', name: 'Column', icon: BarChart4 },
];

const ChartSelector = ({ data, title }) => {
  const [selectedChart, setSelectedChart] = useState('line');

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-surface-500 mt-0.5">Monthly user activity overview</p>
        </div>
        <div className="flex bg-surface-800 rounded-xl p-0.5 border border-surface-700 gap-0.5">
          {chartTypes.map(chart => (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${selectedChart === chart.id
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-sm shadow-brand-500/20'
                  : 'text-surface-500 hover:text-white hover:bg-surface-700'
                }`}
            >
              <chart.icon className="h-3.5 w-3.5" />
              {chart.name}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <AdvancedCharts data={data} chartType={selectedChart} title={title} height={320} />
      </div>
    </div>
  );
};

export default ChartSelector;