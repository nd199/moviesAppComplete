import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Featured from "../Components/Featured";
import Footer from "../Components/Footer";
import List from "../Components/List";
import NavBar from "../Components/NavBar";
import { fetchCurrentUserDetails } from "../Network/ApiCalls";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const currentUser = user?.currentUser;

  useEffect(() => {
    fetchCurrentUserDetails(dispatch, currentUser?.email);
  }, [dispatch, currentUser?.email]);
  return (
    <div className="home">
      <NavBar />
      <div className="main">
        <Featured />
        <List title={"Movies"} />
        <List title={"Shows"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
