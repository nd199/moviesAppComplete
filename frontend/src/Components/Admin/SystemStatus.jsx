import { useState, useEffect, useCallback } from 'react';
import api from '../../AxiosMethods';
import { Check, X, Clock, Server } from 'lucide-react';

const STATUS_CONFIGS = {
  online: {
    dot: 'bg-emerald-400',
    ring: 'shadow-emerald-400/30',
    label: 'Online',
    badge: 'bg-emerald-500/10 text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    icon: HiCheck,
  },
  issues: {
    dot: 'bg-amber-400',
    ring: 'shadow-amber-400/30',
    label: 'Warning',
    badge: 'bg-amber-500/10 text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
    icon: HiClock,
  },
  offline: {
    dot: 'bg-red-400',
    ring: 'shadow-red-400/30',
    label: 'Offline',
    badge: 'bg-red-500/10 text-red-400',
    bar: 'bg-gradient-to-r from-red-500 to-red-400',
    icon: HiX,
  },
  checking: {
    dot: 'bg-surface-500',
    ring: 'shadow-surface-500/30',
    label: 'Checking',
    badge: 'bg-surface-500/10 text-surface-400',
    bar: 'bg-surface-600',
    icon: HiServer,
  },
};

const ServiceCard = ({ name, description, status, responseTime }) => {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.checking;
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(t);
  }, [status]);

  const Icon = config.icon;

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl bg-surface-800/60 border border-surface-700/50 hover:border-surface-600 transition-all duration-300 ${pulse ? 'scale-[1.02]' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div className={`w-3 h-3 rounded-full ${config.dot} shadow-lg ${config.ring} ${status === 'online' ? 'animate-pulse' : ''}`} />
          {status === 'online' && (
            <span className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-30" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-[11px] text-surface-500 truncate">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {responseTime !== null && (
          <span className="text-[11px] text-surface-500 font-mono bg-surface-700/50 px-2 py-0.5 rounded-md">
            {responseTime}ms
          </span>
        )}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${config.badge}`}>
          <Icon className="h-3 w-3 mr-0.5 flex-shrink-0" />
          {config.label}
        </span>
      </div>
    </div>
  );
};

const SystemStatus = () => {
  const [services, setServices] = useState([
    { name: 'API Server', status: 'checking', description: 'Main application server', responseTime: null, uptime: 99.8 },
    { name: 'Database', status: 'checking', description: 'PostgreSQL database connection', responseTime: null, uptime: 99.5 },
    { name: 'Cache Service', status: 'checking', description: 'Redis cache service', responseTime: null, uptime: 99.9 },
  ]);
  const [lastChecked, setLastChecked] = useState(null);

  const checkServices = useCallback(async () => {
    const results = [];

    try {
      const start = Date.now();
      await api.get('/health-check', { timeout: 5000 });
      results.push({ name: 'API Server', status: 'online', description: 'Main application server', responseTime: Date.now() - start, uptime: 99.8 });
    } catch {
      results.push({ name: 'API Server', status: 'offline', description: 'Main application server', responseTime: null, uptime: 0 });
    }

    try {
      const start = Date.now();
      const res = await api.get('/health', { timeout: 5000 });
      const dbStatus = res.data?.database === 'UP' ? 'online' : 'issues';
      results.push({ name: 'Database', status: dbStatus, description: 'PostgreSQL database connection', responseTime: Date.now() - start, uptime: dbStatus === 'online' ? 99.5 : 50 });
    } catch {
      results.push({ name: 'Database', status: 'offline', description: 'PostgreSQL database connection', responseTime: null, uptime: 0 });
    }

    try {
      const start = Date.now();
      const res = await api.get('/health', { timeout: 5000 });
      const cacheStatus = res.data?.redis === 'UP' ? 'online' : 'issues';
      results.push({ name: 'Cache Service', status: cacheStatus, description: 'Redis cache service', responseTime: Date.now() - start, uptime: cacheStatus === 'online' ? 99.9 : 50 });
    } catch {
      results.push({ name: 'Cache Service', status: 'offline', description: 'Redis cache service', responseTime: null, uptime: 0 });
    }

    setServices(results);
    setLastChecked(new Date());
  }, []);

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, [checkServices]);

  const onlineCount = services.filter(s => s.status === 'online').length;
  const avgUptime = services.reduce((sum, s) => sum + (s.uptime || 0), 0) / services.length;

  return (
    <div className="bg-surface-900 rounded-2xl border border-surface-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">System Status</h3>
            <p className="text-xs text-surface-500 mt-0.5 flex items-center gap-1.5">
              <HiCheck className={`h-3 w-3 ${onlineCount === services.length ? 'text-emerald-400' : 'text-amber-400'}`} />
              {onlineCount}/{services.length} services operational
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-white">{avgUptime.toFixed(1)}%</span>
            <span className="text-[10px] text-surface-500">Avg Uptime</span>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-2.5">
        {services.map((service) => (
          <ServiceCard key={service.name} {...service} />
        ))}
        {lastChecked && (
          <div className="text-center pt-2">
            <span className="text-[10px] text-surface-600">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;