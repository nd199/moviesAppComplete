import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Featured from "../../Components/Featured";
import Footer from "../../Components/Footer";
import List from "../../Components/List";
import NavBar from "../../Components/NavBar";
import { fetchCurrentUserDetails } from "../../Network/ApiCalls";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const currentUser = user?.currentUser;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        await fetchCurrentUserDetails(dispatch);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        // Add a small delay to show the skeleton animation
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    fetchUserData();
  }, [dispatch]);

  return (
    <div className="home">
      <NavBar />
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
