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
        <Featured />
        <List title="Trending Movies" type="tmdb-movies" index={0} />
        <List title="Now Playing" type="tmdb-now-playing" index={1} />
        <List title="Popular Movies" type="tmdb-popular" index={2} />
        <List title="Upcoming Movies" type="tmdb-upcoming" index={3} />
        <List title="Top Rated Movies" type="tmdb-top-rated" index={0} />
        <List title="Popular TV Shows" type="tmdb-popular-shows" index={1} />
        <List title="Top Rated TV Shows" type="tmdb-top-rated-shows" index={2} />
        <List title="Trending TV Shows" type="tmdb-shows" index={3} />
        <Footer />
      </div>
    </>
  );
};

export default Home;
