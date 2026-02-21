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
        await fetchCurrentUserDetails(dispatch, currentUser?.email);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        // Add a small delay to show the skeleton animation
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    fetchUserData();
  }, [dispatch, currentUser?.email]);

  return (
    <div className="home">
      <NavBar />
      <div className="main">
        <Featured loading={loading} />
        <List title={"Movies"} />
        <List title={"Shows"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
