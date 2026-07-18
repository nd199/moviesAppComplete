import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchMovies, fetchShows, fetchTmdbTrendingMovies, fetchTmdbTrendingShows, fetchTmdbPopularMovies, fetchTmdbTopRatedMovies, fetchTmdbNowPlayingMovies, fetchTmdbUpcomingMovies, fetchTmdbPopularShows, fetchTmdbTopRatedShows } from '../Network/ApiCalls';
import { MovieListSkeleton } from './GlobalLoader';
import ListItem from './ListItem';
import { useScrollReveal } from '../Utils/useScrollReveal';

SwiperCore.use([Navigation, Pagination]);

const fetchMap = {
  'local': null,
  'tmdb-movies': fetchTmdbTrendingMovies,
  'tmdb-shows': fetchTmdbTrendingShows,
};

const sectionThemes = [
  { bg: 'bg-surface-900', bar: 'from-brand-500 to-accent-500' },
  { bg: 'bg-surface-800/40', bar: 'from-accent-500 to-brand-400' },
  { bg: 'bg-surface-900', bar: 'from-brand-400 to-gold-500' },
  { bg: 'bg-surface-800/40', bar: 'from-accent-400 to-brand-500' },
];

const List = ({ title, type = 'local', index = 0 }) => {
  const dispatch = useDispatch();
  const movies = useSelector(s => s?.product?.movies);
  const shows = useSelector(s => s?.product?.shows);
  const tmdbMovies = useSelector(s => s?.product?.tmdbTrendingMovies);
  const tmdbShows = useSelector(s => s?.product?.tmdbTrendingShows);
  const [loading, setLoading] = useState(true);
  const [extra, setExtra] = useState([]);
  const sectionRef = useScrollReveal({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  useEffect(() => {
    let cancel = false;
    const run = async () => {
      setLoading(true);
      try {
        if (type === 'local') await Promise.all([fetchMovies(dispatch), fetchShows(dispatch)]);
        else if (fetchMap[type]) await fetchMap[type](dispatch);
        else {
          const map = { 'tmdb-popular': fetchTmdbPopularMovies, 'tmdb-top-rated': fetchTmdbTopRatedMovies, 'tmdb-now-playing': fetchTmdbNowPlayingMovies, 'tmdb-upcoming': fetchTmdbUpcomingMovies, 'tmdb-popular-shows': fetchTmdbPopularShows, 'tmdb-top-rated-shows': fetchTmdbTopRatedShows };
          if (map[type]) { const r = await map[type](); if (!cancel) setExtra(r || []); }
        }
      } catch {}
      if (!cancel) setLoading(false);
    };
    run();
    return () => { cancel = true; };
  }, [dispatch, type]);

  const items = type === 'local' ? (title === 'Movies' ? movies : shows)
    : type === 'tmdb-movies' ? tmdbMovies
    : type === 'tmdb-shows' ? tmdbShows
    : extra;

  const isShow = ['tmdb-shows', 'tmdb-popular-shows', 'tmdb-top-rated-shows'].includes(type);
  const format = (item) => ({ id: item.tmdbId, tmdbId: item.tmdbId, name: item.title || item.name, desc: item.description, year: item.year, ageRating: item.ageRating, rating: item.rating, runtime: item.runtime, genre: item.genre, poster: item.poster, trailer: item.trailer, mediaType: isShow ? 'tv' : 'movie' });

  if (loading) return <MovieListSkeleton count={5} />;
  if (!items?.length) return null;

  const theme = sectionThemes[index % 4];

  return (
    <section ref={sectionRef} className={`reveal w-full py-10 px-[3.5vw] ${theme.bg}`}>
      <div className="flex items-end justify-between gap-4 mb-6 px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-white m-0 tracking-tight">{title}</h2>
          <div className={`h-[3px] w-14 mt-2.5 rounded-full bg-gradient-to-r ${theme.bar}`} />
        </div>
        {type === 'local' && (
          <Link to={title === 'Movies' ? '/movies' : '/shows'} className="text-[0.7rem] tracking-widest text-brand-300 no-underline uppercase px-4 py-2 rounded-xl border border-brand-500/30 hover:bg-brand-500/10 transition-all font-medium">
            VIEW ALL
          </Link>
        )}
      </div>

      <Swiper key={items.length + type} modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView="auto" navigation pagination={{ clickable: true }} className="pb-8">
        {items.map((item, idx) => {
          const f = type.startsWith('tmdb') ? format(item) : item;
          return (
            <SwiperSlide key={item.id || item.tmdbId || idx} style={{ width: 'auto' }}>
              <ListItem id={f.id} tmdbId={f.tmdbId} name={f.name} desc={f.desc} year={f.year} ageRating={f.ageRating} rating={f.rating} runtime={f.runtime} genre={f.genre} poster={f.poster} trailer={f.trailer} mediaType={f.mediaType} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>{`
        .swiper-pagination{bottom:0!important}
        .swiper-pagination-bullet{width:24px!important;height:4px!important;margin:0 4px!important;background:rgba(255,255,255,.1)!important;opacity:1!important;transition:all .3s!important;border-radius:2px!important}
        .swiper-pagination-bullet-active{background:linear-gradient(90deg,#7c3aed,#06b6d4)!important;width:32px!important;box-shadow:0 0 10px rgba(124,58,237,.3)!important}
        .swiper-button-prev,.swiper-button-next{width:36px!important;height:36px!important;border-radius:10px!important;background:rgba(255,255,255,.06)!important;color:#fff!important;border:1px solid rgba(255,255,255,.08)!important;top:38%!important;transition:all .3s!important;backdrop-filter:blur(8px)!important}
        .swiper-button-prev{left:4px!important}.swiper-button-next{right:4px!important}
        .swiper-button-prev::after,.swiper-button-next::after{font-size:.8rem!important;font-weight:700!important}
        .swiper-button-prev:hover,.swiper-button-next:hover{background:linear-gradient(135deg,#7c3aed,#06b6d4)!important;border-color:rgba(124,58,237,.4)!important;box-shadow:0 0 25px rgba(124,58,237,.3)!important}
        @media(max-width:640px){.swiper-button-prev,.swiper-button-next{display:none!important}}
      `}</style>
    </section>
  );
};

export default List;
