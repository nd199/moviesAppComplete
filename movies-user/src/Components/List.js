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
import './List.css';
import ListItem from './ListItem';

SwiperCore.use([Navigation, Pagination]);

const List = ({ title, type = 'local' }) => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state?.product?.movies);
  const shows = useSelector(state => state?.product?.shows);
  const tmdbMovies = useSelector(state => state?.product?.tmdbTrendingMovies);
  const tmdbShows = useSelector(state => state?.product?.tmdbTrendingShows);
  const [loading, setLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === 'local') {
          // Fetch local movies and shows
          await Promise.all([
            fetchMovies(dispatch),
            fetchShows(dispatch)
          ]);
        } else if (type === 'tmdb-movies') {
          // Fetch TMDB trending movies
          await fetchTmdbTrendingMovies(dispatch);
        } else if (type === 'tmdb-shows') {
          // Fetch TMDB trending shows
          await fetchTmdbTrendingShows(dispatch);
        } else if (type === 'tmdb-popular') {
          // Fetch TMDB popular movies
          const results = await fetchTmdbPopularMovies(dispatch);
          setPopularMovies(results);
        } else if (type === 'tmdb-top-rated') {
          // Fetch TMDB top rated movies
          const results = await fetchTmdbTopRatedMovies(dispatch);
          setTopRatedMovies(results);
        } else if (type === 'tmdb-now-playing') {
          // Fetch TMDB now playing movies
          const results = await fetchTmdbNowPlayingMovies(dispatch);
          setNowPlayingMovies(results);
        } else if (type === 'tmdb-upcoming') {
          // Fetch TMDB upcoming movies
          const results = await fetchTmdbUpcomingMovies(dispatch);
          setUpcomingMovies(results);
        } else if (type === 'tmdb-popular-shows') {
          // Fetch TMDB popular TV shows
          const results = await fetchTmdbPopularShows(dispatch);
          setPopularShows(results);
        } else if (type === 'tmdb-top-rated-shows') {
          // Fetch TMDB top rated TV shows
          const results = await fetchTmdbTopRatedShows(dispatch);
          setTopRatedShows(results);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, type]);

  const getViewAllLink = () => {
    if (type === 'local') {
      return title === 'Movies' ? '/movies' : title === 'Shows' ? '/shows' : '#';
    }
    return '#'; // No view all for TMDB sections yet
  };

  // Get items based on type
  const getItems = () => {
    if (type === 'local') {
      return title === 'Movies' ? movies : shows;
    } else if (type === 'tmdb-movies') {
      return tmdbMovies || [];
    } else if (type === 'tmdb-shows') {
      return tmdbShows || [];
    } else if (type === 'tmdb-popular') {
      return popularMovies || [];
    } else if (type === 'tmdb-top-rated') {
      return topRatedMovies || [];
    } else if (type === 'tmdb-now-playing') {
      return nowPlayingMovies || [];
    } else if (type === 'tmdb-upcoming') {
      return upcomingMovies || [];
    } else if (type === 'tmdb-popular-shows') {
      return popularShows || [];
    } else if (type === 'tmdb-top-rated-shows') {
      return topRatedShows || [];
    }
    return [];
  };

  const items = getItems();

  // For TMDB items, map the fields to match the ListItem format
  const formatTmdbItem = (item) => {
    if (type === 'tmdb-movies' || type === 'tmdb-shows' || type === 'tmdb-popular' || type === 'tmdb-top-rated' || 
        type === 'tmdb-now-playing' || type === 'tmdb-upcoming' || type === 'tmdb-popular-shows' || type === 'tmdb-top-rated-shows') {
      return {
        id: item.tmdbId,
        name: item.title || item.name,
        desc: item.description,
        year: item.year,
        ageRating: item.ageRating,
        rating: item.rating,
        runtime: item.runtime,
        genre: item.genre,
        poster: item.poster,
        trailer: item.trailer,
      };
    }
    return item;
  };

  if (loading) {
    return <MovieListSkeleton count={5} />;
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="row-section">
      <div className="row-header">
        <div>
          <h2 className="row-title">{title}</h2>
          <p className="row-subtitle">
            {type === 'tmdb-movies' || type === 'tmdb-shows' 
              ? 'Popular from TMDB' 
              : `Handpicked ${title.toLowerCase()} for you`}
          </p>
        </div>
        {type === 'local' && (
          <Link to={getViewAllLink()} className="row-view-all">
            VIEW ALL
          </Link>
        )}
      </div>

      <div className="row-swiper-wrapper">
        <Swiper
          key={items.length + type}
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            1440: { slidesPerView: 6 },
            1240: { slidesPerView: 5 },
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            480: { slidesPerView: 2 },
            0: { slidesPerView: 1.2 },
          }}
          className="row-swiper">
          {items.map((item, idx) => {
            const formattedItem = formatTmdbItem(item);
            return (
              <SwiperSlide key={item.id || item.tmdbId || idx} className="row-slide">
                <ListItem
                  id={formattedItem.id}
                  name={formattedItem.name}
                  desc={formattedItem.desc}
                  year={formattedItem.year}
                  ageRating={formattedItem.ageRating}
                  rating={formattedItem.rating}
                  runtime={formattedItem.runtime}
                  genre={formattedItem.genre}
                  poster={formattedItem.poster}
                  trailer={formattedItem.trailer}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default List;
