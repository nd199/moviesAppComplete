// Mock data service for development and demo purposes

export const getStatistics = () => {
  return [
    {
      title: 'Total Users',
      value: '2,543',
      change: 12.5,
      icon: 'HiUserGroup'
    },
    {
      title: 'Active Movies',
      value: '186',
      change: -3.2,
      icon: 'HiFilm'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: 8.7,
      icon: 'HiCurrencyDollar'
    },
    {
      title: 'Bookings Today',
      value: '342',
      change: 15.3,
      icon: 'HiCalendar'
    }
  ];
};

export const getHealthStatus = (serviceName) => {
  const mockHealthData = {
    'API Server': {
      status: 'healthy',
      responseTime: Math.floor(Math.random() * 100) + 50,
      lastChecked: new Date().toISOString()
    },
    'Database': {
      status: 'healthy',
      responseTime: Math.floor(Math.random() * 50) + 20,
      lastChecked: new Date().toISOString()
    },
    'Cache': {
      status: 'healthy',
      responseTime: Math.floor(Math.random() * 30) + 10,
      lastChecked: new Date().toISOString()
    },
    'Storage': {
      status: 'healthy',
      responseTime: Math.floor(Math.random() * 80) + 40,
      lastChecked: new Date().toISOString()
    }
  };

  return mockHealthData[serviceName] || {
    status: 'unknown',
    responseTime: 0,
    lastChecked: new Date().toISOString()
  };
};

export const getUserStats = () => {
  return {
    totalUsers: 2543,
    activeUsers: 1876,
    newUsersThisMonth: 342,
    userGrowthRate: 12.5
  };
};

export const getMovieStats = () => {
  return {
    totalMovies: 186,
    activeMovies: 142,
    newMoviesThisMonth: 8,
    averageRating: 4.2
  };
};

export const getBookingStats = () => {
  return {
    totalBookings: 12543,
    bookingsThisMonth: 2341,
    revenueThisMonth: 45678,
    averageBookingValue: 19.5
  };
};

export default {
  getStatistics,
  getHealthStatus,
  getUserStats,
  getMovieStats,
  getBookingStats
};
