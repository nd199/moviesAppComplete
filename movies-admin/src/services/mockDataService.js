// Mock data service to provide fallback data when backend APIs return 500 errors
export const mockDataService = {
  // Mock statistics data
  getStatistics: () => ({
    revenue: { current: 12500, previous: 10000, change: 25 },
    users: { current: 1234, previous: 1000, change: 23.4 },
    movies: { current: 567, previous: 500, change: 13.4 },
    subscriptions: { current: 890, previous: 800, change: 11.25 },
  }),

  // Mock subscription data
  getLatestSubscriptions: () => [
    { id: 1, user: { name: 'John Doe', email: 'john@example.com' }, plan: { name: 'Premium', price: 15.99 }, status: 'ACTIVE', createdAt: new Date() },
    { id: 2, user: { name: 'Jane Smith', email: 'jane@example.com' }, plan: { name: 'Basic', price: 9.99 }, status: 'PENDING', createdAt: new Date(Date.now() - 86400000) },
    { id: 3, user: { name: 'Bob Johnson', email: 'bob@example.com' }, plan: { name: 'Premium', price: 15.99 }, status: 'CANCELLED', createdAt: new Date(Date.now() - 172800000) },
    { id: 4, user: { name: 'Alice Brown', email: 'alice@example.com' }, plan: { name: 'Standard', price: 12.99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 259200000) },
    { id: 5, user: { name: 'Charlie Wilson', email: 'charlie@example.com' }, plan: { name: 'Basic', price: 9.99 }, status: 'ACTIVE', createdAt: new Date(Date.now() - 345600000) }
  ],

  // Mock income data
  getIncomeData: () => [
    { total: 15000 },
    { total: 18000 }
  ],

  // Mock user stats for charts
  getUserStats: () => [
    { name: 'Jan', "Active User": 400, "New Users": 240 },
    { name: 'Feb', "Active User": 300, "New Users": 139 },
    { name: 'Mar', "Active User": 200, "New Users": 380 },
    { name: 'Apr', "Active User": 278, "New Users": 390 },
    { name: 'May', "Active User": 189, "New Users": 480 },
    { name: 'Jun', "Active User": 239, "New Users": 380 },
  ],

  // Mock health check responses
  getHealthStatus: (service) => {
    const statuses = {
      'API Server': { status: 'online', responseTime: Math.floor(Math.random() * 100) + 50 },
      'Database': { status: 'online', responseTime: Math.floor(Math.random() * 50) + 20 },
      'Payment Gateway': { status: 'issues', responseTime: null, error: 'Payment gateway not configured' },
      'Email Service': { status: 'online', responseTime: Math.floor(Math.random() * 200) + 100 },
      'Storage Service': { status: 'issues', responseTime: null, error: 'Storage service not configured' },
      'Cache Service': { status: 'online', responseTime: Math.floor(Math.random() * 30) + 10 }
    };
    return statuses[service] || { status: 'offline', responseTime: null, error: 'Service unknown' };
  }
};

export default mockDataService;
