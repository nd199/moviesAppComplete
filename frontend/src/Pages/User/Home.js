import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Featured from "../../Components/Featured";
import Footer from "../../Components/Footer";
import List from "../../Components/List";
import { fetchCurrentUserDetails } from "../../Network/ApiCalls";
import GlobalLoader from "../../Components/GlobalLoader";
import { useScrollReveal } from "../../Utils/useScrollReveal";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const heroRef = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    const hasToken = localStorage.getItem('accessToken');
    if (hasToken) {
      fetchCurrentUserDetails(dispatch).catch(() => {}).finally(() => setTimeout(() => setLoading(false), 400));
    } else { setLoading(false); }
  }, [dispatch]);

  return (
    <>
      {loading && <GlobalLoader open message="Loading..." />}
      <div className="min-h-screen bg-surface-950">
        {/* Hero Featured Section - full viewport */}
        <Featured />

        {/* Gradient transition strip */}
        <div className="relative h-32 -mt-1 bg-gradient-to-b from-surface-950 via-surface-900/50 to-surface-950">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
        </div>

        {/* Movie Lists with scroll-reveal staggered entry */}
        <div className="relative">
          <div className="particle-field" />
          <List title="Trending Movies" type="tmdb-movies" index={0} />
          <List title="Now Playing" type="tmdb-now-playing" index={1} />
          <List title="Popular Movies" type="tmdb-popular" index={2} />
          <List title="Upcoming Movies" type="tmdb-upcoming" index={3} />
          <List title="Top Rated Movies" type="tmdb-top-rated" index={0} />

          {/* Mid-page CTA break */}
          <div ref={heroRef} className="reveal reveal-delay-2 py-16 px-6">
            <div className="max-w-[900px] mx-auto text-center relative rounded-3xl overflow-hidden py-16 px-8"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-500/10 blur-[100px] pointer-events-none" />
              <p className="text-gradient text-xs font-bold uppercase tracking-[0.2em] mb-4 m-0">Discover More</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white m-0 mb-4 leading-tight">
                Your Next Favorite<br />Is Here
              </h2>
              <p className="text-[#8892b0] text-sm max-w-[400px] mx-auto m-0 mb-6">
                Explore thousands of movies and TV shows across every genre, curated just for you.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a href="/movies" className="btn-primary inline-flex text-sm no-underline !px-6 !py-2.5">Browse Movies</a>
                <a href="/shows" className="btn-secondary inline-flex text-sm no-underline !px-6 !py-2.5">Explore Shows</a>
              </div>
            </div>
          </div>

          <List title="Popular TV Shows" type="tmdb-popular-shows" index={1} />
          <List title="Top Rated TV Shows" type="tmdb-top-rated-shows" index={2} />
          <List title="Trending TV Shows" type="tmdb-shows" index={3} />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
