import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Featured from "../../Components/Featured";
import Footer from "../../Components/Footer";
import List from "../../Components/List";
import { fetchCurrentUserDetails } from "../../Network/ApiCalls";
import GlobalLoader from "../../Components/GlobalLoader";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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

        {/* Content Lists — interleaved movies and shows */}
        <div className="relative">
          <div className="particle-field" />
          <List title="Trending Movies" type="tmdb-movies" index={0} />
          <List title="Trending TV Shows" type="tmdb-shows" index={1} />
          <List title="Popular Movies" type="tmdb-popular" index={2} />
          <List title="Popular TV Shows" type="tmdb-popular-shows" index={3} />
          <List title="Top Rated Movies" type="tmdb-top-rated" index={0} />
          <List title="Top Rated TV Shows" type="tmdb-top-rated-shows" index={1} />
          <List title="Now Playing" type="tmdb-now-playing" index={2} />
          <List title="Upcoming Movies" type="tmdb-upcoming" index={3} />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
