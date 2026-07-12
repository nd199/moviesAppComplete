/**
 * Mock API Interceptor
 * Intercepts axios requests and returns mock data when REACT_APP_MOCK_MODE=true
 * Allows the frontend to run fully standalone without any backend.
 */

import {
  mockUser,
  mockMovies,
  mockShows,
  mockSouthIndianMovies,
  mockSubscriptionPlans,
  mockWatchlist,
  mockNotifications,
} from './mockData';

// Helper to simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated local storage for watchlist (persists across page reloads)
const getLocalWatchlist = () => {
  try {
    const stored = localStorage.getItem('mock_watchlist');
    return stored ? JSON.parse(stored) : [...mockWatchlist];
  } catch {
    return [...mockWatchlist];
  }
};

const saveLocalWatchlist = (list) => {
  localStorage.setItem('mock_watchlist', JSON.stringify(list));
};

// Route matcher: returns mock data based on URL pattern
function matchRoute(method, url) {
  const m = method.toLowerCase();
  const u = url.toLowerCase();

  // ─── Auth ──────────────────────────────────────
  if (m === 'post' && u.includes('/auth/login')) {
    return {
      data: {
        accessToken: 'mock_access_token_dev',
        refreshToken: 'mock_refresh_token_dev',
        user: mockUser,
      },
    };
  }
  if (m === 'post' && (u.includes('/auth/customers') || u.includes('/auth/register'))) {
    return { data: { ...mockUser, message: 'Registration successful' } };
  }
  if (m === 'post' && u.includes('/auth/logout')) {
    return { data: { message: 'Logged out' } };
  }
  if (m === 'post' && u.includes('/auth/refresh-token')) {
    return {
      data: {
        accessToken: 'mock_access_token_refreshed',
        refreshToken: 'mock_refresh_token_refreshed',
      },
    };
  }
  if (m === 'post' && u.includes('/auth/change-password')) {
    return { data: { message: 'Password changed successfully' } };
  }

  // ─── Profile ───────────────────────────────────
  if (m === 'get' && u.includes('/profile/current')) {
    return { data: mockUser };
  }
  if (m === 'put' && u.includes('/profile/current')) {
    return { data: { ...mockUser, message: 'Profile updated' } };
  }

  // ─── OTP / Email Verification ──────────────────
  if (m === 'post' && u.includes('/verify/email')) {
    return { data: { message: 'OTP sent to email', email: 'naren@cnio.dev' } };
  }
  if (m === 'post' && u.includes('/validate/otp')) {
    return { data: { message: 'OTP validated', valid: true } };
  }

  // ─── Password Reset ────────────────────────────
  if (m === 'post' && u.includes('/password-reset/request')) {
    return { data: { message: 'Password reset email sent' } };
  }
  if (m === 'post' && u.includes('/password-reset/reset')) {
    return { data: { message: 'Password reset successful' } };
  }

  // ─── Movies ────────────────────────────────────
  if (m === 'get' && u.includes('/movies') && !u.includes('category') && !u.includes('sort') && !u.includes('search') && !u.includes('tmdb')) {
    return { data: mockMovies };
  }
  if (m === 'get' && u.includes('/movies/categories')) {
    return { data: ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Crime', 'Fantasy', 'Romance', 'Thriller'] };
  }
  if (m === 'get' && u.includes('/movies/search')) {
    const query = new URL(url, 'http://localhost').searchParams.get('q') || '';
    const filtered = mockMovies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    return { data: filtered };
  }
  if (m === 'get' && u.includes('/movies/category/')) {
    return { data: mockMovies };
  }
  if (m === 'get' && u.includes('/movies/sort/')) {
    return { data: mockMovies };
  }

  // ─── Shows ─────────────────────────────────────
  if (m === 'get' && u.includes('/shows') && !u.includes('category') && !u.includes('sort') && !u.includes('search') && !u.includes('tmdb')) {
    return { data: mockShows };
  }
  if (m === 'get' && u.includes('/shows/categories')) {
    return { data: ['Drama', 'Sci-Fi', 'Fantasy', 'Action', 'Crime', 'Comedy', 'Thriller', 'Reality'] };
  }
  if (m === 'get' && u.includes('/shows/search')) {
    const query = new URL(url, 'http://localhost').searchParams.get('q') || '';
    const filtered = mockShows.filter((s) =>
      (s.name || s.title || '').toLowerCase().includes(query.toLowerCase())
    );
    return { data: filtered };
  }
  if (m === 'get' && u.includes('/shows/category/')) {
    return { data: mockShows };
  }
  if (m === 'get' && u.includes('/shows/sort/')) {
    return { data: mockShows };
  }

  // ─── TMDB ──────────────────────────────────────
  if (m === 'get' && u.includes('/tmdb/trending/movies')) {
    return { data: { results: mockMovies.slice(0, 10) } };
  }
  if (m === 'get' && u.includes('/tmdb/trending/shows')) {
    return { data: { results: mockShows.slice(0, 10) } };
  }
  if (m === 'get' && u.includes('/tmdb/discover/movies')) {
    return { data: { results: mockMovies.slice(2, 8) } };
  }
  if (m === 'get' && u.includes('/tmdb/top-rated/movies')) {
    return { data: { results: [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 8) } };
  }
  if (m === 'get' && u.includes('/tmdb/now-playing/movies')) {
    return { data: { results: mockMovies.slice(0, 6) } };
  }
  if (m === 'get' && u.includes('/tmdb/upcoming/movies')) {
    return { data: { results: mockMovies.slice(4, 10) } };
  }
  if (m === 'get' && u.includes('/tmdb/popular/shows')) {
    return { data: { results: mockShows.slice(0, 8) } };
  }
  if (m === 'get' && u.includes('/tmdb/top-rated/shows')) {
    return { data: { results: [...mockShows].sort((a, b) => b.rating - a.rating).slice(0, 8) } };
  }
  if (m === 'get' && u.includes('/tmdb/south-indian/movies')) {
    return { data: { results: mockSouthIndianMovies } };
  }
  if (m === 'get' && u.includes('/tmdb/popular/movies')) {
    return { data: { results: mockMovies.slice(0, 8) } };
  }
  if (m === 'get' && u.includes('/tmdb/search/movies')) {
    const query = new URL(url, 'http://localhost').searchParams.get('query') || '';
    const filtered = mockMovies.filter((mv) =>
      mv.title.toLowerCase().includes(query.toLowerCase())
    );
    return { data: { results: filtered } };
  }
  if (m === 'get' && u.includes('/tmdb/search/shows')) {
    const query = new URL(url, 'http://localhost').searchParams.get('query') || '';
    const filtered = mockShows.filter((s) =>
      (s.name || s.title || '').toLowerCase().includes(query.toLowerCase())
    );
    return { data: { results: filtered } };
  }
  if (m === 'get' && u.match(/\/tmdb\/movie\/\d+/)) {
    const id = parseInt(u.match(/\/tmdb\/movie\/(\d+)/)?.[1]);
    return { data: mockMovies.find((m) => m.tmdbId === id) || mockMovies[0] };
  }
  if (m === 'get' && u.match(/\/tmdb\/tv\/\d+/)) {
    const id = parseInt(u.match(/\/tmdb\/tv\/(\d+)/)?.[1]);
    return { data: mockShows.find((s) => s.tmdbId === id) || mockShows[0] };
  }

  // ─── Products ──────────────────────────────────
  if (m === 'get' && u.includes('/products/allproducts')) {
    return { data: { movies: mockMovies.slice(0, 5), shows: mockShows.slice(0, 5) } };
  }

  // ─── Subscription ──────────────────────────────
  if (m === 'get' && u.includes('/subscription/plans')) {
    return { data: mockSubscriptionPlans };
  }
  if (m === 'get' && u.includes('/subscription/current')) {
    return {
      data: {
        plan: mockSubscriptionPlans[1],
        status: 'active',
        expiresAt: '2025-12-31T23:59:59Z',
      },
    };
  }
  if (m === 'post' && u.includes('/subscription/intent')) {
    return { data: { clientSecret: 'mock_client_secret', subscriptionId: 'sub_mock_123' } };
  }

  // ─── Watchlist ─────────────────────────────────
  if (m === 'get' && u.includes('/watchlist/check/')) {
    const parts = u.split('/');
    const tmdbId = parts[parts.length - 2];
    const mediaType = parts[parts.length - 1];
    const list = getLocalWatchlist();
    const inList = list.some((w) => String(w.tmdbId) === tmdbId && w.mediaType === mediaType);
    return { data: { inWatchlist: inList } };
  }
  if (m === 'get' && u.includes('/watchlist/count')) {
    return { data: { count: getLocalWatchlist().length } };
  }
  if (m === 'get' && u.includes('/watchlist')) {
    return { data: getLocalWatchlist() };
  }
  if (m === 'post' && u.includes('/watchlist')) {
    return { data: { message: 'Added to watchlist' } };
  }
  if (m === 'delete' && u.includes('/watchlist/')) {
    return { data: { message: 'Removed from watchlist' } };
  }

  // ─── Streaming watchlist (alternate endpoint) ───
  if (m === 'get' && u.includes('/streaming/watchlist')) {
    return { data: getLocalWatchlist() };
  }
  if (m === 'post' && u.includes('/streaming/watchlist')) {
    return { data: { message: 'Added to watchlist' } };
  }
  if (m === 'delete' && u.includes('/streaming/watchlist/')) {
    return { data: { message: 'Removed from watchlist' } };
  }
  if (m === 'get' && u.includes('/streaming/history')) {
    return { data: [] };
  }
  if (m === 'get' && u.includes('/streaming/movie/')) {
    return { data: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' } };
  }
  if (m === 'get' && u.includes('/streaming/show/')) {
    return { data: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' } };
  }

  // ─── Payment ───────────────────────────────────
  if (m === 'post' && u.includes('/payments/subscribe-success')) {
    return { data: { message: 'Subscription activated', data: { userData: { ...mockUser, isSubscribed: true } } } };
  }
  if (m === 'post' && u.includes('/payments/ping')) {
    return { data: { message: 'pong' } };
  }
  if (m === 'get' && u.includes('/payments/history')) {
    return { data: [] };
  }
  if (m === 'post' && u.includes('/submitPayment')) {
    return { data: { success: true, transactionId: 'txn_mock_123' } };
  }

  // ─── Notifications ─────────────────────────────
  if (m === 'get' && u.includes('/notifications') && !u.includes('settings')) {
    return { data: mockNotifications };
  }
  if (m === 'put' && u.includes('/notifications/read-all')) {
    return { data: { message: 'All notifications marked as read' } };
  }
  if (m === 'put' && u.match(/\/notifications\/\d+\/read/)) {
    return { data: { message: 'Notification marked as read' } };
  }
  if (m === 'get' && u.includes('/notifications/settings')) {
    return { data: { email: true, push: true, sms: false } };
  }

  // ─── Health / Ping ─────────────────────────────
  if (m === 'get' && u.includes('/ping')) {
    return { data: { status: 'ok', mode: 'mock' } };
  }

  // ─── Admin (stubs) ─────────────────────────────
  if (m === 'get' && u.includes('/admin/users')) {
    return { data: [mockUser] };
  }
  if (m === 'get' && u.includes('/admin/analytics')) {
    return { data: { totalUsers: 1, totalMovies: mockMovies.length, totalShows: mockShows.length } };
  }

  // No match — return null so the real axios call proceeds
  return null;
}

/**
 * Install the mock interceptor on an axios instance.
 * Call this once at app startup when MOCK_MODE is enabled.
 */
export function installMockInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const method = config.method || 'get';
      const url = `${config.baseURL || ''}${config.url || ''}`;
      const response = matchRoute(method, url);

      if (response) {
        await delay(200 + Math.random() * 300);
        // Cancel the real request and return mock data directly
        const error = new Error('MOCK_REQUEST');
        error.config = config;
        error.mockResponse = { data: response.data, status: 200, statusText: 'OK', headers: {}, config };
        return Promise.reject(error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Catch our mock errors and resolve them as successful responses
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.message === 'MOCK_REQUEST' && error.mockResponse) {
        return Promise.resolve(error.mockResponse);
      }
      return Promise.reject(error);
    }
  );
}
