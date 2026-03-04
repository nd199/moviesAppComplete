import { AddToQueueOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './Featured.css';
import VideoPlayer from './VideoPlayer';
import { FeaturedSkeleton } from './GlobalLoader';
import { publicRequest } from '../AxiosMethods';

const Featured = () => {
  const [featuredData, setFeaturedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await publicRequest().get('/tmdb/south-indian/movies?page=1');
        const movies = response.data.results?.slice(0, 10) || [];
        setFeaturedData(movies);
      } catch (error) {
        console.error('Failed to load featured movies:', error);
        setFeaturedData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const toggleMore = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) return <FeaturedSkeleton />;

  if (!featuredData.length) {
    return (
      <section className="featured-slider">
        <div className="featured-empty">
          <h2>No Featured Movies Available</h2>
          <Link to="/movies" className="featured-btn featured-btn-primary">
            Browse Movies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 15000, disableOnInteraction: false }}
        loop
        className="featured-swiper"
      >
        {featuredData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="featured-slide">

              {item.trailer && (
                <div className="featured-video-bg">
                  <VideoPlayer
                    className="featured-video"
                    videoId={item.trailer.split('v=')[1] || ''}
                    isYouTube
                  />
                </div>
              )}

              <div className="featured-overlay" />

              <div className="featured-content-wrapper">
                <div className="featured-info">

                  <div className="featured-tags">
                    <div className="featured-tag featured-tag-south">
                      South Indian
                    </div>
                    <div className="featured-tag">Now Streaming</div>
                  </div>

                  <h1 className="featured-title">{item.title}</h1>

                  <div className="featured-meta">
                    <span>{item.year}</span>
                    <span className="featured-dot" />
                    <span className="featured-rating">{item.ageRating}</span>
                    <span className="featured-dot" />
                    <span>{item.genre}</span>
                  </div>

                  <div className="featured-desc">
                    <p>{item.description}</p>

                    {expandedItems[index] && (
                      <p className="featured-desc-more">
                        {item.description}
                      </p>
                    )}

                    <button
                      className="featured-more-btn"
                      onClick={() => toggleMore(index)}
                    >
                      {expandedItems[index] ? 'Show less' : 'More...'}
                    </button>
                  </div>

                  <div className="featured-buttons">
                    <Link
                      to={`/video/${item.title}`}
                      state={{ trailer: item.trailer }}
                      className="featured-btn featured-btn-primary"
                    >
                      <PlayArrowOutlined />
                      Watch Now
                    </Link>

                    <button className="featured-btn featured-btn-secondary">
                      <AddToQueueOutlined />
                      Watchlist
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Featured;