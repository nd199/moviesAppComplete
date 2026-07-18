import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ArrowBack, PlayArrow, Star, CalendarToday, Movie } from "@mui/icons-material";
import { fetchTmdbMovieDetails, fetchTmdbTvShowDetails, fetchMovieCast, fetchTvShowCast, fetchSimilarMovies, fetchSimilarTvShows } from "../../Network/ApiCalls";
import { publicRequest } from "../../AxiosMethods";
import WatchlistButton from "../../Components/WatchlistButton";
import ListItem from "../../Components/ListItem";
import GlobalLoader from "../../Components/GlobalLoader";

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = location.pathname.startsWith('/movie') ? 'movie' : 'tv';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const tmdbId = parseInt(id);
        if (isNaN(tmdbId)) {
          const res = await publicRequest().get(`/tmdb/search/${type === 'movie' ? 'movies' : 'shows'}?query=${encodeURIComponent(id)}`);
          const results = res.data?.results || [];
          if (results.length > 0) {
            const realId = results[0].tmdbId;
            const details = type === 'movie'
              ? await fetchTmdbMovieDetails(realId)
              : await fetchTmdbTvShowDetails(realId);
            setItem(details);
            const castData = type === 'movie' ? await fetchMovieCast(realId) : await fetchTvShowCast(realId);
            setCast(castData);
            const similarData = type === 'movie' ? await fetchSimilarMovies(realId) : await fetchSimilarTvShows(realId);
            setSimilar(similarData);
          }
        } else {
          const details = type === 'movie'
            ? await fetchTmdbMovieDetails(tmdbId)
            : await fetchTmdbTvShowDetails(tmdbId);
          setItem(details);
          const castData = type === 'movie' ? await fetchMovieCast(tmdbId) : await fetchTvShowCast(tmdbId);
          setCast(castData);
          const similarData = type === 'movie' ? await fetchSimilarMovies(tmdbId) : await fetchSimilarTvShows(tmdbId);
          setSimilar(similarData);
        }
      } catch (e) {
        console.error("Failed to load details:", e);
      }
      setLoading(false);
    };
    load();
  }, [id, type]);

  if (loading) return <GlobalLoader open message="Loading..." />;
  if (!item) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#5a6380] m-0 mb-4">Could not load details.</p>
        <Link to="/" className="text-brand-400 text-sm no-underline hover:text-brand-300">Go Home</Link>
      </div>
    </div>
  );

  const title = item.title || item.name;
  const displayRating = item.rating != null ? Number(item.rating).toFixed(1) : null;
  const posterUrl = item.poster || 'https://via.placeholder.com/400x600/111827/3b4560?text=No+Image';
  const backdropUrl = item.backdrop || item.poster;
  const genres = item.genre ? item.genre.split(',').map(g => g.trim()).slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={backdropUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-surface-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 via-transparent to-transparent" />

        {/* Back button */}
        <Link to={-1} className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl bg-surface-950/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white no-underline hover:bg-surface-950/80 transition-all">
          <ArrowBack sx={{ fontSize: 20 }} />
        </Link>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
          <div className="max-w-[1200px] mx-auto flex gap-6 sm:gap-8 items-end">
            {/* Poster */}
            <img src={posterUrl} alt={title} className="hidden sm:block w-[180px] rounded-2xl shadow-2xl border border-white/10" />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-5xl font-black text-white m-0 mb-3 leading-tight">{title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {displayRating && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-950/70 backdrop-blur-sm border border-white/10 text-sm">
                    <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                    <span className="text-white font-bold">{displayRating}</span>
                  </span>
                )}
                {item.year && (
                  <span className="flex items-center gap-1.5 text-[#8892b0] text-sm">
                    <CalendarToday sx={{ fontSize: 14 }} /> {item.year}
                  </span>
                )}
                {item.runtime && (
                  <span className="flex items-center gap-1.5 text-[#8892b0] text-sm">
                    <Movie sx={{ fontSize: 14 }} /> {item.runtime}
                  </span>
                )}
                {item.ageRating && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase">
                    {item.ageRating}
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((g, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-[#8892b0]">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {item.tagline && (
                <p className="text-[#5a6380] text-sm italic m-0 mb-3">"{item.tagline}"</p>
              )}

              <div className="flex items-center gap-3 mt-4">
                {item.trailer && (
                  <Link
                    to={`/video/${title}`}
                    state={{ trailer: item.trailer }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold no-underline hover:shadow-lg hover:shadow-brand-500/25 transition-all"
                  >
                    <PlayArrow sx={{ fontSize: 20 }} /> Watch Trailer
                  </Link>
                )}
                {item.tmdbId && (
                  <WatchlistButton
                    tmdbId={item.tmdbId}
                    mediaType={type}
                    title={title}
                    posterPath={posterUrl}
                    className="!px-5 !py-2.5"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Description */}
        {item.description && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white m-0 mb-3">Overview</h2>
            <p className="text-[#8892b0] text-sm leading-relaxed m-0 max-w-[800px]">{item.description}</p>
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white m-0 mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
              {cast.map((member, i) => (
                <div key={i} className="shrink-0 w-[120px] text-center">
                  {member.profilePath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${member.profilePath}`}
                      alt={member.name}
                      className="w-[100px] h-[100px] rounded-full object-cover mx-auto mb-2 border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded-full bg-white/5 border-2 border-white/10 mx-auto mb-2 flex items-center justify-center text-[#5a6380] text-2xl font-bold">
                      {member.name?.charAt(0)}
                    </div>
                  )}
                  <p className="text-white text-xs font-semibold m-0 truncate">{member.name}</p>
                  <p className="text-[#5a6380] text-[0.65rem] m-0 truncate">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white m-0 mb-4">
              {type === 'movie' ? 'Similar Movies' : 'Similar Shows'}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
              {similar.map((s, i) => (
                <div key={i} className="shrink-0">
                  <ListItem
                    id={s.tmdbId}
                    tmdbId={s.tmdbId}
                    name={s.title || s.name}
                    year={s.year}
                    poster={s.poster}
                    rating={s.rating}
                    genre={s.genre}
                    trailer={s.trailer}
                    mediaType={type}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
