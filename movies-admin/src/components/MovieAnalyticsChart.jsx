import React, { useState, useEffect } from 'react';
import AdvancedCharts from './AdvancedCharts';
import api from '../services/api';

const MovieAnalyticsChart = () => {
  const [movieData, setMovieData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('bar');

  useEffect(() => {
    fetchMovieAnalytics();
  }, []);

  const fetchMovieAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - replace with real API calls
      const mockMovieData = [
        { name: 'Action', count: 45, avgRating: 4.2, totalViews: 12000 },
        { name: 'Comedy', count: 32, avgRating: 3.8, totalViews: 8000 },
        { name: 'Drama', count: 28, avgRating: 4.5, totalViews: 9500 },
        { name: 'Horror', count: 15, avgRating: 3.9, totalViews: 4500 },
        { name: 'Romance', count: 20, avgRating: 3.7, totalViews: 6000 },
        { name: 'Sci-Fi', count: 18, avgRating: 4.3, totalViews: 7200 },
      ];

      const mockGenreData = [
        { name: 'Action', value: 45, color: '#ef4444' },
        { name: 'Comedy', value: 32, color: '#a855f7' },
        { name: 'Drama', value: 28, color: '#3b82f6' },
        { name: 'Horror', value: 15, color: '#10b981' },
        { name: 'Romance', value: 20, color: '#f59e0b' },
        { name: 'Sci-Fi', value: 18, color: '#8b5cf6' },
      ];

      const mockRatingData = [
        { name: '1 Star', count: 5 },
        { name: '2 Stars', count: 12 },
        { name: '3 Stars', count: 45 },
        { name: '4 Stars', count: 78 },
        { name: '5 Stars', count: 35 },
      ];

      setMovieData(mockMovieData);
      setGenreData(mockGenreData);
      setRatingData(mockRatingData);
      
    } catch (error) {
      console.error('Error fetching movie analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Movie Analytics</h3>
        <div className="flex gap-2">
          {['bar', 'area', 'pie', 'line'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChart(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedChart === type
                  ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h4 className="text-md font-medium text-slate-100 mb-4">Genre Performance</h4>
            <AdvancedCharts data={movieData} chartType={selectedChart} title="Genre Analytics" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <h4 className="text-md font-medium text-slate-100 mb-4">Genre Distribution</h4>
          <AdvancedCharts data={genreData} chartType="pie" title="Genre Distribution" />
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
        <h4 className="text-md font-medium text-slate-100 mb-4">Rating Distribution</h4>
        <AdvancedCharts data={ratingData} chartType="bar" title="Rating Distribution" />
      </div>

      {/* Movie Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total Movies</p>
              <p className="text-xl font-semibold text-slate-100">158</p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">🎬</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Avg Rating</p>
              <p className="text-xl font-semibold text-slate-100">4.2</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400">⭐</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total Views</p>
              <p className="text-xl font-semibold text-slate-100">47.2k</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400">👁️</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Top Genre</p>
              <p className="text-xl font-semibold text-slate-100">Action</p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-400">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieAnalyticsChart;
