import { useState } from 'react';

const SystemStatus = () => {
  const [services] = useState([
    { name: 'API Server', status: 'online', description: 'Main application server', responseTime: 45 },
    { name: 'Database', status: 'online', description: 'PostgreSQL database connection', responseTime: 12 },
    { name: 'Cache Service', status: 'online', description: 'Redis cache service', responseTime: 8 },
  ]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'online': return { dot: 'bg-emerald-400', ring: 'ring-emerald-400/30', label: 'Operational', labelBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' };
      case 'issues': return { dot: 'bg-amber-400', ring: 'ring-amber-400/30', label: 'Degraded', labelBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20' };
      case 'offline': return { dot: 'bg-red-400', ring: 'ring-red-400/30', label: 'Down', labelBg: 'bg-red-500/15 text-red-400 border border-red-500/20' };
      default: return { dot: 'bg-gray-400', ring: 'ring-gray-400/30', label: 'Unknown', labelBg: 'bg-gray-500/15 text-gray-400 border border-gray-500/20' };
    }
  };

  const onlineCount = services.filter(s => s.status === 'online').length;

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">System Status</h3>
            <p className="text-sm text-white/80 mt-0.5">{onlineCount}/{services.length} services operational</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {services.map((service) => {
          const config = getStatusConfig(service.status);
          return (
            <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.dot} ring-4 ${config.ring}`} />
                <div>
                  <p className="text-sm font-medium text-white">{service.name}</p>
                  <p className="text-xs text-surface-500">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-surface-500 font-mono">{service.responseTime}ms</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.labelBg}`}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemStatus;
