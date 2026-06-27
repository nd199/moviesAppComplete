import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Featured from "../../Components/Featured";
import Footer from "../../Components/Footer";
import List from "../../Components/List";
import { fetchCurrentUserDetails } from "../../Network/ApiCalls";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // Only try to fetch user if there's a token in localStorage
      const hasToken = localStorage.getItem('accessToken');
      
      if (hasToken) {
        setLoading(true);
        try {
          await fetchCurrentUserDetails(dispatch);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setTimeout(() => setLoading(false), 500);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [dispatch]);

  return (
    <div className="home">
      <div className="main">
        <Featured loading={loading} />
        <List title={"Trending Movies"} type="tmdb-movies" />
        <List title={"Now Playing"} type="tmdb-now-playing" />
        <List title={"Popular Movies"} type="tmdb-popular" />
        <List title={"Upcoming Movies"} type="tmdb-upcoming" />
        <List title={"Top Rated Movies"} type="tmdb-top-rated" />
        <List title={"Popular TV Shows"} type="tmdb-popular-shows" />
        <List title={"Top Rated TV Shows"} type="tmdb-top-rated-shows" />
        <List title={"Trending TV Shows"} type="tmdb-shows" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
