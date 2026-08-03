import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, TrendingUp, CalendarDays } from 'lucide-react';
import { fetchReactionStats } from '../../services/adminApi';

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const BarRow = ({ item, type }) => {
  const pct = type === 'like' ? item.likePercentage : item.dislikePercentage;
  const fill = type === 'like'
    ? 'bg-gradient-to-r from-rose-500 to-pink-500'
    : 'bg-gradient-to-r from-sky-500 to-cyan-500';
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-medium text-white truncate max-w-[55%]">{item.title}</span>
        <span className="text-surface-400 shrink-0 ml-2">{item.liked} 👍 · {item.disliked} 👎</span>
      </div>
      <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
        <div className={`h-full ${fill} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const ListCard = ({ title, icon: Icon, color, items, type }) => (
  <div className="bg-surface-900 rounded-2xl border border-surface-700 p-5">
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wide">{title}</h3>
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-surface-500 py-6 text-center">No reactions yet</p>
    ) : (
      items.map((item, i) => <BarRow key={`${item.tmdbId}-${i}`} item={item} type={type} />)
    )}
  </div>
);

const ReactionStats = () => {
  const [data, setData] = useState(null);
  const [activePeriod, setActivePeriod] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchReactionStats();
        setData(res);
      } catch (error) {
        console.error('Error fetching reaction stats:', error);
        setData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-surface-900 rounded-2xl border border-surface-700 animate-pulse" />
        <div className="h-64 bg-surface-900 rounded-2xl border border-surface-700 animate-pulse" />
      </div>
    );
  }

  const overall = data?.overall || { totalLikes: 0, totalDislikes: 0, likePercentage: 0, dislikePercentage: 0 };
  const mostLiked = data?.mostLiked || [];
  const mostDisliked = data?.mostDisliked || [];
  const periodItems = data?.byPeriod?.[activePeriod] || [];
  const totalReactions = overall.totalLikes + overall.totalDislikes;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-surface-900 to-surface-800 rounded-2xl border border-surface-700 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-sky-500 flex items-center justify-center">
              <ThumbsUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Content Reactions</h2>
              <p className="text-xs text-surface-500">Like vs dislike split and top rated content</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-surface-800/60 border border-surface-700/50">
              <p className="text-2xl font-bold text-rose-400">{overall.totalLikes.toLocaleString()}</p>
              <p className="text-xs text-surface-500 mt-1">Total Likes</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-800/60 border border-surface-700/50">
              <p className="text-2xl font-bold text-sky-400">{overall.totalDislikes.toLocaleString()}</p>
              <p className="text-xs text-surface-500 mt-1">Total Dislikes</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-800/60 border border-surface-700/50">
              <p className="text-2xl font-bold text-white">{totalReactions.toLocaleString()}</p>
              <p className="text-xs text-surface-500 mt-1">Total Reactions</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-rose-400 font-semibold">{overall.likePercentage}% Liked</span>
              <span className="text-sky-400 font-semibold">{overall.dislikePercentage}% Disliked</span>
            </div>
            <div className="h-3 bg-surface-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700" style={{ width: `${overall.likePercentage}%` }} />
              <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-700" style={{ width: `${overall.dislikePercentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard title="Most Liked" icon={ThumbsUp} color="bg-gradient-to-br from-rose-500 to-pink-600" items={mostLiked} type="like" />
        <ListCard title="Most Disliked" icon={ThumbsDown} color="bg-gradient-to-br from-sky-500 to-cyan-600" items={mostDisliked} type="dislike" />
      </div>

      <div className="bg-surface-900 rounded-2xl border border-surface-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wide">Most Liked by Period</h3>
          <div className="ml-auto flex gap-1 bg-surface-800 rounded-xl p-0.5 border border-surface-700">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setActivePeriod(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePeriod === p.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : 'text-surface-500 hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {periodItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-surface-500">
            <TrendingUp className="h-8 w-8" />
            <p className="text-sm">No likes recorded {PERIODS.find(p => p.key === activePeriod)?.label.toLowerCase()}</p>
          </div>
        ) : (
          periodItems.map((item, i) => (
            <div key={`${item.tmdbId}-${i}`} className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-white truncate max-w-[55%]">
                  {i + 1}. {item.title}
                </span>
                <span className="text-surface-400 shrink-0 ml-2">{item.liked} likes</span>
              </div>
              <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${item.likePercentage}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReactionStats;
