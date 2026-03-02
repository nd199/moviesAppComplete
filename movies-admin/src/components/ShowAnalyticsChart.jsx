import React, { useState, useEffect } from 'react';
import AdvancedCharts from './AdvancedCharts';
import api from '../services/api';

const ShowAnalyticsChart = () => {
  const [showData, setShowData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('bar');

  useEffect(() => {
    fetchShowAnalytics();
  }, []);

  const fetchShowAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - replace with real API calls
      const mockShowData = [
        { name: 'Drama', count: 38, avgRating: 4.6, totalViews: 15000 },
        { name: 'Comedy', count: 25, avgRating: 4.1, totalViews: 9200 },
        { name: 'Thriller', count: 22, avgRating: 4.3, totalViews: 11000 },
        { name: 'Crime', count: 18, avgRating: 4.7, totalViews: 8500 },
        { name: 'Sci-Fi', count: 15, avgRating: 4.4, totalViews: 7800 },
        { name: 'Romance', count: 12, avgRating: 3.9, totalViews: 5200 },
      ];

      const mockGenreData = [
        { name: 'Drama', value: 38, color: '#ef4444' },
        { name: 'Comedy', value: 25, color: '#a855f7' },
        { name: 'Thriller', value: 22, color: '#3b82f6' },
        { name: 'Crime', value: 18, color: '#10b981' },
        { name: 'Sci-Fi', value: 15, color: '#f59e0b' },
        { name: 'Romance', value: 12, color: '#8b5cf6' },
      ];

      const mockRatingData = [
        { name: '1 Star', count: 3 },
        { name: '2 Stars', count: 8 },
        { name: '3 Stars', count: 32 },
        { name: '4 Stars', count: 68 },
        { name: '5 Stars', count: 41 },
      ];

      setShowData(mockShowData);
      setGenreData(mockGenreData);
      setRatingData(mockRatingData);
      
    } catch (error) {
      console.error('Error fetching show analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-4 dark:bg-slate-600"></div>
            <div className="h-48 bg-slate-700 rounded dark:bg-slate-600"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100 dark:text-white">Show Analytics</h3>
        <div className="flex gap-2">
          {['bar', 'area', 'pie', 'line'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChart(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedChart === type
                  ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-600/50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur dark:border-slate-700/50 dark:bg-slate-800/50">
            <h4 className="text-md font-medium text-slate-100 mb-4 dark:text-white">Genre Performance</h4>
            <AdvancedCharts data={showData} chartType={selectedChart} title="Genre Analytics" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur dark:border-slate-700/50 dark:bg-slate-800/50">
          <h4 className="text-md font-medium text-slate-100 mb-4 dark:text-white">Genre Distribution</h4>
          <AdvancedCharts data={genreData} chartType="pie" title="Genre Distribution" />
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur dark:border-slate-700/50 dark:bg-slate-800/50">
        <h4 className="text-md font-medium text-slate-100 mb-4 dark:text-white">Rating Distribution</h4>
        <AdvancedCharts data={ratingData} chartType="bar" title="Rating Distribution" />
      </div>

      {/* Show Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400">Total Shows</p>
              <p className="text-xl font-semibold text-slate-100 dark:text-white">130</p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">📺</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400">Avg Rating</p>
              <p className="text-xl font-semibold text-slate-100 dark:text-white">4.3</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400">⭐</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400">Total Views</p>
              <p className="text-xl font-semibold text-slate-100 dark:text-white">56.7k</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400">👁️</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400">Top Genre</p>
              <p className="text-xl font-semibold text-slate-100 dark:text-white">Drama</p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-400">🎭</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAnalyticsChart;
