import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History } from "@mui/icons-material";
import { getRecentViews } from "../Network/ApiCalls";

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getRecentViews().then(setItems).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 px-4">
        <History sx={{ fontSize: 22, color: '#8892b0' }} />
        <h2 className="text-lg font-bold text-white m-0">Recently Viewed</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
        {items.map((item, i) => (
          <Link
            key={`${item.tmdbId}-${item.mediaType}-${i}`}
            to={item.mediaType === 'movie' ? `/movie/${item.tmdbId}` : `/show/${item.tmdbId}`}
            className="shrink-0 w-[140px] group no-underline"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all">
              <img
                src={item.posterPath || 'https://via.placeholder.com/140x210/111827/3b4560?text=No+Image'}
                alt={item.title}
                className="w-full h-[210px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-white text-xs font-medium mt-2 m-0 truncate">{item.title}</p>
            <p className="text-[#5a6380] text-[0.65rem] m-0 capitalize">{item.mediaType}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
