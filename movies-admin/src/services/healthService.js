import api from './api';

// Health check service for monitoring system components
export const healthService = {
  // Check API server health
  checkApiServer: async () => {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return {
        status: 'online',
        data: response.data,
        responseTime: response.responseTime || 0
      };
    } catch (error) {
      return {
        status: 'offline',
        error: error.message,
        responseTime: null
      };
    }
  },

  // Check database connection
  checkDatabase: async () => {
    try {
      const response = await api.get('/health/db', { timeout: 5000 });
      return {
        status: 'online',
        data: response.data,
        responseTime: response.responseTime || 0
      };
    } catch (error) {
      return {
        status: 'offline',
        error: error.message,
        responseTime: null
      };
    }
  },

  // Check payment gateway
  checkPaymentGateway: async () => {
    try {
      const response = await api.get('/health/payment', { timeout: 5000 });
      return {
        status: 'online',
        data: response.data,
        responseTime: response.responseTime || 0
      };
    } catch (error) {
      // If endpoint doesn't exist, simulate with mock data
      if (error.response?.status === 404) {
        return {
          status: 'issues',
          error: 'Payment gateway not configured',
          responseTime: null
        };
      }
      return {
        status: 'offline',
        error: error.message,
        responseTime: null
      };
    }
  },

  // Check email service
  checkEmailService: async () => {
    try {
      const response = await api.get('/health/email', { timeout: 5000 });
      return {
        status: 'online',
        data: response.data,
        responseTime: response.responseTime || 0
      };
    } catch (error) {
      // If endpoint doesn't exist, simulate with mock data
      if (error.response?.status === 404) {
        return {
          status: 'issues',
          error: 'Email service not configured',
          responseTime: null
        };
      }
      return {
        status: 'offline',
        error: error.message,
        responseTime: null
      };
    }
  },

  // Check storage service
  checkStorageService: async () => {
    try {
      const response = await api.get('/health/storage', { timeout: 5000 });
      return {
        status: 'online',
        data: response.data,
        responseTime: response.responseTime || 0
      };
    } catch (error) {
      // If endpoint doesn't exist, simulate with mock data
      if (error.response?.status === 404) {
        return {
          status: 'issues',
          error: 'Storage service not configured',
          responseTime: null
        };
      }
      return {
        status: 'offline',
        error: error.message,
        responseTime: null
      };
    }
  },

  // Check cache service (Redis)
  checkCacheService: async () => {
    try {
      const response = await api.get('/health/redis', { timeout: 5000 });
      return {
        status: 'online',
        data: response.data,
        responseTime: response.responseTime || 0
      };
    } catch (error) {
      // If endpoint doesn't exist, simulate with mock data
      if (error.response?.status === 404) {
        return {
          status: 'issues',
          error: 'Cache service not configured',
          responseTime: null
        };
      }
      return {
        status: 'offline',
        error: error.message,
        responseTime: null
      };
    }
  },

  // Get overall system health
  getOverallHealth: async () => {
    const services = await Promise.allSettled([
      healthService.checkApiServer(),
      healthService.checkDatabase(),
      healthService.checkPaymentGateway(),
      healthService.checkEmailService(),
      healthService.checkStorageService(),
      healthService.checkCacheService()
    ]);

    return services.map((result, index) => {
      const serviceNames = ['API Server', 'Database', 'Payment Gateway', 'Email Service', 'Storage Service', 'Cache Service'];
      const endpoints = ['/health', '/health/db', '/health/payment', '/health/email', '/health/storage', '/health/redis'];
      
      if (result.status === 'fulfilled') {
        return {
          name: serviceNames[index],
          endpoint: endpoints[index],
          ...result.value
        };
      } else {
        return {
          name: serviceNames[index],
          endpoint: endpoints[index],
          status: 'offline',
          error: result.reason.message,
          responseTime: null
        };
      }
    });
  }
};

export default healthService;
