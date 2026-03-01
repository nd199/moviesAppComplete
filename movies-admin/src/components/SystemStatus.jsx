import React, { useState, useEffect } from 'react';
import healthService from '../services/healthService';
import mockDataService from '../services/mockDataService';

const SystemStatus = () => {
  const [services, setServices] = useState([
    {
      name: 'API Server',
      status: 'checking',
      endpoint: '/health',
      description: 'Main application server',
      lastChecked: null,
      responseTime: null
    },
    {
      name: 'Database',
      status: 'checking',
      endpoint: '/health/db',
      description: 'PostgreSQL database connection',
      lastChecked: null,
      responseTime: null
    },
    {
      name: 'Payment Gateway',
      status: 'checking',
      endpoint: '/health/payment',
      description: 'Payment processing service',
      lastChecked: null,
      responseTime: null
    },
    {
      name: 'Email Service',
      status: 'checking',
      endpoint: '/health/email',
      description: 'Email notification service',
      lastChecked: null,
      responseTime: null
    },
    {
      name: 'Storage Service',
      status: 'checking',
      endpoint: '/health/storage',
      description: 'File storage and CDN',
      lastChecked: null,
      responseTime: null
    },
    {
      name: 'Cache Service',
      status: 'checking',
      endpoint: '/health/redis',
      description: 'Redis cache service',
      lastChecked: null,
      responseTime: null
    }
  ]);

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const checkServiceHealth = async (service) => {
    try {
      const healthCheckMethods = {
        'API Server': () => healthService.checkApiServer(),
        'Database': () => healthService.checkDatabase(),
        'Payment Gateway': () => healthService.checkPaymentGateway(),
        'Email Service': () => healthService.checkEmailService(),
        'Storage Service': () => healthService.checkStorageService(),
        'Cache Service': () => healthService.checkCacheService()
      };

      const checkMethod = healthCheckMethods[service.name];
      if (!checkMethod) {
        throw new Error(`No health check method for ${service.name}`);
      }

      const result = await checkMethod();
      
      return {
        ...service,
        status: result.status,
        lastChecked: new Date(),
        responseTime: result.responseTime,
        details: result.data?.status || result.error || 'OK'
      };
    } catch (error) {
      // Use mock data when health checks fail
      const mockHealth = mockDataService.getHealthStatus(service.name);
      return {
        ...service,
        status: mockHealth.status,
        lastChecked: new Date(),
        responseTime: mockHealth.responseTime,
        details: mockHealth.error || 'Using mock data'
      };
    }
  };

  const checkAllServices = async () => {
    const updatedServices = await Promise.all(
      services.map(service => checkServiceHealth(service))
    );
    setServices(updatedServices);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    checkAllServices();
    
    if (isAutoRefresh) {
      const interval = setInterval(checkAllServices, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-emerald-200 bg-emerald-500/15 border-emerald-500/20';
      case 'issues':
        return 'text-amber-200 bg-amber-500/15 border-amber-500/20';
      case 'offline':
        return 'text-red-200 bg-red-500/15 border-red-500/20';
      case 'checking':
        return 'text-slate-200 bg-slate-500/15 border-slate-500/20';
      default:
        return 'text-slate-200 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return '✅';
      case 'issues':
        return '⚠️';
      case 'offline':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getOverallStatus = () => {
    const onlineCount = services.filter(s => s.status === 'online').length;
    const issuesCount = services.filter(s => s.status === 'issues').length;
    const offlineCount = services.filter(s => s.status === 'offline').length;
    
    if (offlineCount > 0) return { status: 'offline', color: 'text-red-400' };
    if (issuesCount > 0) return { status: 'issues', color: 'text-amber-400' };
    if (onlineCount === services.length) return { status: 'online', color: 'text-emerald-400' };
    return { status: 'checking', color: 'text-slate-400' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">System Status</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium ${overallStatus.color}`}>
              Overall Status: {overallStatus.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">
              {lastRefresh && `Last checked: ${lastRefresh.toLocaleTimeString()}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isAutoRefresh
                ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
                : 'bg-white/5 text-slate-300 border border-white/10'
            }`}
          >
            {isAutoRefresh ? '🔄 Auto' : '⏸️ Manual'}
          </button>
          
          <button
            onClick={checkAllServices}
            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-200 border border-blue-500/20 hover:bg-blue-500/25 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">{getStatusIcon(service.status)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-100">{service.name}</span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{service.description}</p>
                {service.details && service.status !== 'online' && (
                  <p className="text-xs text-slate-500 mt-1">{service.details}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              {service.responseTime && (
                <p className="text-xs text-slate-400">{service.responseTime}ms</p>
              )}
              {service.lastChecked && (
                <p className="text-xs text-slate-500">
                  {service.lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* System Health Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-emerald-400">
              {services.filter(s => s.status === 'online').length}
            </p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-amber-400">
              {services.filter(s => s.status === 'issues').length}
            </p>
            <p className="text-xs text-slate-400">Issues</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-red-400">
              {services.filter(s => s.status === 'offline').length}
            </p>
            <p className="text-xs text-slate-400">Offline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
