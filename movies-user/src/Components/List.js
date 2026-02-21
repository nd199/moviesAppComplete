import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchMovies, fetchShows } from '../Network/ApiCalls';
import { MovieListSkeleton } from './GlobalLoader';
import './List.css';
import ListItem from './ListItem';

SwiperCore.use([Navigation, Pagination]);

const List = ({ title }) => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state?.product?.movies);
  const shows = useSelector(state => state?.product?.shows);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMovies(dispatch),
          fetchShows(dispatch)
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const getViewAllLink = title =>
    title === 'Movies' ? '/movies' : title === 'Shows' ? '/shows' : '#';

  const items = title === 'Movies' ? movies : shows;

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
            Handpicked {title.toLowerCase()} for you
          </p>
        </div>
        <Link to={getViewAllLink(title)} className="row-view-all">
          VIEW ALL
        </Link>
      </div>

      <div className="row-swiper-wrapper">
        <Swiper
          key={items.length}
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
          {items.map((item, idx) => (
            <SwiperSlide key={item.id || idx} className="row-slide">
              <ListItem
                id={item.id || item.show_id}
                name={item.name}
                desc={item.description}
                year={item.year}
                ageRating={item.ageRating}
                rating={item.rating}
                runtime={item.runtime}
                genre={item.genre}
                poster={item.poster}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default List;
