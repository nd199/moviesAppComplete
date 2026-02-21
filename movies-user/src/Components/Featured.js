import { AddToQueueOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Featured.css';
import VideoPlayer from './VideoPlayer';
import { FeaturedSkeleton } from './GlobalLoader';
import { publicRequest } from '../AxiosMethods';

const Featured = ({ loading = false }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [featuredData, setFeaturedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedData = async () => {
      setIsLoading(true);
      try {
        // Fetch trending movies from TMDB
        const response = await publicRequest().get('/tmdb/trending/movies');
        const movies = response.data.results || [];
        
        // Get first 5 trending movies and fetch their videos
        const featuredMovies = await Promise.all(
          movies.slice(0, 5).map(async (movie) => {
            try {
              // Fetch videos for this movie
              const videoResponse = await publicRequest().get(`/tmdb/movie/${movie.tmdbId}/videos`);
              const videos = videoResponse.data.results || [];
              
              // Find the first trailer or teaser
              const trailer = videos.find(video => 
                video.type === 'Trailer' || video.type === 'Teaser'
              );
              
              return {
                title: movie.title,
                year: movie.year,
                rating: movie.ageRating || 'PG-13',
                genre: movie.genre || 'Action',
                desc: movie.description || 'No description available',
                descMore: movie.description || 'No description available',
                videoId: trailer ? trailer.key : '',
                hasTrailer: !!trailer
              };
            } catch (error) {
              console.error(`Error fetching videos for movie ${movie.tmdbId}:`, error);
              return {
                title: movie.title,
                year: movie.year,
                rating: movie.ageRating || 'PG-13',
                genre: movie.genre || 'Action',
                desc: movie.description || 'No description available',
                descMore: movie.description || 'No description available',
                videoId: '',
                hasTrailer: false
              };
            }
          })
        );
        
        setFeaturedData(featuredMovies.filter(movie => movie.hasTrailer));
      } catch (error) {
        console.error('Error fetching featured data:', error);
        // Fallback to empty array
        setFeaturedData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading) {
      fetchFeaturedData();
    }
  }, [loading]);
  
  if (loading || isLoading) {
    return <FeaturedSkeleton />;
  }

  const toggleMore = index => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="featured-slider">
      <div className="featured-header">
        <h2 className="featured-title-main">Featured</h2>
        <span className="featured-subtitle">
          Epic movies handpicked for you
        </span>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        className="featured-swiper">
        {featuredData.length > 0 && featuredData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="featured-slide">
              <div className="featured-overlay" />

              <div className="featured-grid">
                <div className="featured-video-wrapper">
                  <VideoPlayer
                    className="featured-video"
                    videoId={item.videoId}
                    isYouTube={true}
                  />
                </div>

                <div className="featured-info">
                  <div className="featured-tag">Now Streaming</div>

                  <h1 className="featured-title">{item.title}</h1>

                  <div className="featured-meta">
                    <span className="featured-year">{item.year}</span>
                    <span className="featured-dot" />
                    <span className="featured-rating">{item.rating}</span>
                    <span className="featured-dot" />
                    <span className="featured-genre">{item.genre}</span>
                  </div>

                  <div className="featured-desc">
                    <p>{item.desc}</p>

                    {expandedItems[index] && (
                      <p className="featured-desc-more">{item.descMore}</p>
                    )}

                    <button
                      className="featured-more-btn"
                      onClick={() => toggleMore(index)}>
                      {expandedItems[index] ? 'Show less' : 'More...'}
                    </button>
                  </div>

                  <div className="featured-buttons">
                    <button className="featured-btn featured-btn-primary">
                      <PlayArrowOutlined className="featured-btn-icon" />
                      <span>Watch</span>
                    </button>

                    <button className="featured-btn featured-btn-secondary">
                      <AddToQueueOutlined className="featured-btn-icon" />
                      <span>
                        <span className="featured-btn-sm-hidden">Add to </span>
                        Watchlist
                      </span>
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
