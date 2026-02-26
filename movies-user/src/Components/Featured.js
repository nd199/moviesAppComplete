import { AddToQueueOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Featured.css';
import VideoPlayer from './VideoPlayer';
import { FeaturedSkeleton } from './GlobalLoader';
import { publicRequest } from '../AxiosMethods';
import { fetchTmdbSouthIndianMovies } from '../Network/ApiCalls';

const Featured = ({ loading = false }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [featuredData, setFeaturedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedData = async () => {
      setIsLoading(true);
      try {
        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development' || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        let selectedMovies = [];
        let southIndianMovies = []; // Define in outer scope
        
        if (isDevelopment) {
          // In development, use local movies from database
          console.log('Development mode: Using local movies');
          const moviesResponse = await publicRequest().get('/movies');
          const localMovies = moviesResponse.data || [];
          
          // Take first 6 movies for featured section
          selectedMovies = localMovies.slice(0, 6);
          
          console.log('Local movies for featured:', selectedMovies.length);
        } else {
          // In production, use TMDB movies
          console.log('Production mode: Using TMDB movies');
          const [southIndianResponse, hollywoodResponse] = await Promise.all([
            publicRequest().get('/tmdb/trending/movies'),
            fetchTmdbSouthIndianMovies()
          ]);
          
          const hollywoodMovies = hollywoodResponse.data.results || [];
          southIndianMovies = southIndianResponse || []; // Assign to outer scope variable
          
          console.log('Hollywood movies:', hollywoodMovies.length);
          console.log('South Indian movies:', southIndianMovies.length);
          
          // Mix: 3 Hollywood + 3 South Indian movies
          selectedMovies = [
            ...southIndianMovies.slice(0, 3),
            ...hollywoodMovies.slice(0, 3),
          ];
        }
        
        // Get videos for all selected movies
        const featuredMovies = await Promise.all(
          selectedMovies.map(async (movie) => {
            try {
              let trailer = null;
              
              // Only fetch videos for TMDB movies (in production)
              if (!isDevelopment && movie.tmdbId) {
                const videoResponse = await publicRequest().get(`/tmdb/movie/${movie.tmdbId}/videos`);
                const videos = videoResponse.data.results || [];
                
                // Find the first trailer or teaser
                trailer = videos.find(video => 
                  video.type === 'Trailer' || video.type === 'Teaser'
                );
              }
              
              return {
                title: movie.title,
                year: movie.year,
                rating: movie.ageRating || 'PG-13',
                genre: movie.genre || 'Action',
                desc: movie.description || 'No description available',
                descMore: movie.description || 'No description available',
                videoId: trailer ? trailer.key : '',
                hasTrailer: !!trailer,
                trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
                isSouthIndian: isDevelopment ? false : southIndianMovies.some(si => si.tmdbId === movie.tmdbId)
              };
            } catch (error) {
              console.error(`Error processing movie ${movie.title}:`, error);
              return {
                title: movie.title,
                year: movie.year,
                rating: movie.ageRating || 'PG-13',
                genre: movie.genre || 'Action',
                desc: movie.description || 'No description available',
                descMore: movie.description || 'No description available',
                videoId: '',
                hasTrailer: false,
                trailerUrl: '',
                isSouthIndian: false
              };
            }
          })
        );
        
        // Filter movies with trailers, but keep at least some South Indian movies even without trailers
        const moviesWithTrailers = featuredMovies.filter(movie => movie.hasTrailer);
        const southIndianWithoutTrailers = featuredMovies.filter(movie => !movie.hasTrailer && movie.isSouthIndian);
        
        // Prioritize movies with trailers, but add South Indian movies if needed
        let finalFeatured = moviesWithTrailers;
        if (finalFeatured.length < 4 && southIndianWithoutTrailers.length > 0) {
          finalFeatured = [...finalFeatured, ...southIndianWithoutTrailers.slice(0, 4 - finalFeatured.length)];
        }
        
        setFeaturedData(finalFeatured.slice(0, 6)); // Max 6 movies (3 Hollywood + 3 South Indian)
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
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
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
              {/* Full screen video background */}
              <div className="featured-video-bg">
                <VideoPlayer
                  className="featured-video"
                  videoId={item.videoId}
                  isYouTube={true}
                />
              </div>

              {/* Cinematic gradient overlay */}
              <div className="featured-overlay" />

              {/* Floating content wrapper - info panel to the side */}
              <div className="featured-content-wrapper">
                <div className="featured-info">
                  <div className="featured-tags">
                    {item.isSouthIndian && (
                      <div className="featured-tag featured-tag-south">South Indian</div>
                    )}
                    <div className="featured-tag">Now Streaming</div>
                  </div>

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
                    <Link 
                      to={`/video/${item.title}`}
                      state={{ trailer: item.trailerUrl }}
                      className="featured-btn featured-btn-primary"
                    >
                      <PlayArrowOutlined className="featured-btn-icon" />
                      <span>Watch Now</span>
                    </Link>

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
