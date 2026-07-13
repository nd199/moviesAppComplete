import { PlayArrowOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import VideoPlayer from './VideoPlayer';
import { FeaturedSkeleton } from './GlobalLoader';
import { publicRequest } from '../AxiosMethods';
import WatchlistButton from './WatchlistButton';

const Featured = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicRequest().get('/tmdb/south-indian/movies?page=1')
      .then(r => setData(r.data.results?.slice(0, 10) || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FeaturedSkeleton />;
  if (!data.length) return (
    <section className="relative w-full h-screen bg-surface-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white mb-4 m-0">No Featured Movies</h2>
        <Link to="/movies" className="btn-primary inline-flex no-underline">Browse Movies</Link>
      </div>
    </section>
  );

  return (
    <section className="relative w-full h-screen min-h-[min(560px,80vh)] max-h-[850px] bg-black -mt-16">
      <Swiper modules={[Navigation, Pagination, Autoplay]} slidesPerView={1} navigation pagination={{ clickable: true }} autoplay={{ delay: 7000, disableOnInteraction: false }} loop className="h-full">
        {data.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              {item.trailer && (
                <div className="absolute inset-0">
                  <VideoPlayer className="w-full h-full" videoId={item.trailer.split('v=')[1] || ''} isYouTube />
                </div>
              )}

              {/* Layered gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/60 to-transparent z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-black/40 z-[1]" />
              {/* Colored glow accents */}
              <div className="absolute bottom-0 left-[5%] w-[500px] h-[250px] bg-brand-500/10 blur-[120px] z-[1] pointer-events-none" />
              <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] bg-accent-500/8 blur-[140px] z-[1] pointer-events-none" />

              <div className="relative z-[2] h-full flex items-end pb-24 px-[6vw] max-w-[1400px] mx-auto">
                <div className="max-w-[560px] flex flex-col gap-4 animate-slide-left">
                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" /> Featured
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-accent-500/15 text-accent-300 border border-accent-500/25 backdrop-blur-sm">
                      {item.genre}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-[clamp(2.8rem,5.5vw,5rem)] leading-[0.9] font-black text-white m-0 tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    {item.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#8892b0]">{item.year}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[0.7rem] font-bold uppercase">{item.ageRating}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    <span className="text-[#8892b0]">{item.genre}</span>
                  </div>

                  {/* Description */}
                  <p className="text-[0.9rem] leading-relaxed text-[#8892b0] m-0 line-clamp-3">{item.description}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-2">
                    <Link to={`/video/${item.title}`} state={{ trailer: item.trailer }}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 max-md:px-6 max-md:py-3 rounded-xl btn-primary no-underline text-[0.9rem]">
                      <PlayArrowOutlined sx={{ fontSize: 22 }} /> Watch Now
                    </Link>
                    <WatchlistButton
                      tmdbId={item.tmdbId}
                      mediaType="movie"
                      title={item.title}
                      posterPath={item.poster}
                      className="!rounded-xl !bg-white/5 !border-white/10 !text-white hover:!bg-white/10 hover:!border-brand-500/30 backdrop-blur-sm"
                      showLabel={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-button-prev,.swiper-button-next{
          color:#fff!important;
          background:rgba(255,255,255,.08)!important;
          width:42px!important;height:42px!important;
          border-radius:50%!important;
          border:1px solid rgba(255,255,255,.1)!important;
          transition:all .3s cubic-bezier(.4,0,.2,1)!important;
          top:50%!important;transform:translateY(-50%)!important;
          backdrop-filter:blur(10px)!important;
          box-shadow:0 4px 15px rgba(0,0,0,.3)!important;
        }
        .swiper-button-prev{left:1.5rem!important}
        .swiper-button-next{right:1.5rem!important}
        .swiper-button-prev::after,.swiper-button-next::after{
          font-size:.9rem!important;font-weight:800!important;
          transition:transform .3s cubic-bezier(.4,0,.2,1)!important;
        }
        .swiper-button-prev:hover::after{transform:translateX(-2px)!important}
        .swiper-button-next:hover::after{transform:translateX(2px)!important}
        .swiper-button-prev:hover,.swiper-button-next:hover{
          background:rgba(124,58,237,.85)!important;
          border-color:rgba(124,58,237,.6)!important;
          box-shadow:0 0 25px rgba(124,58,237,.4),0 4px 15px rgba(0,0,0,.3)!important;
          transform:translateY(-50%) scale(1.05)!important;
        }
        .swiper-pagination{bottom:2.5rem!important;left:6vw!important;width:auto!important}
        .swiper-pagination-bullet{width:28px!important;height:4px!important;background:rgba(255,255,255,.15)!important;opacity:1!important;transition:all .3s!important;border-radius:2px!important}
        .swiper-pagination-bullet-active{background:linear-gradient(90deg,#7c3aed,#06b6d4)!important;width:40px!important;box-shadow:0 0 15px rgba(124,58,237,.4)!important}
        @media(max-width:768px){.swiper-button-prev,.swiper-button-next{display:none!important}.swiper-pagination{bottom:1.5rem!important}}
      `}</style>
    </section>
  );
};

export default Featured;
