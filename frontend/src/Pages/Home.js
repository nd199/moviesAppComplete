import React, { useEffect } from "react";
import "./Home.css";
import NavBar from "../Components/NavBar";
import Featured from "../Components/Featured";
import List from "../Components/List";
import Footer from "../Components/Footer";
import { fetchCurrentUserDetails } from "../Network/ApiCalls";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const currentUser = user?.currentUser;

  useEffect(() => {
    fetchCurrentUserDetails(dispatch, currentUser?.email);
  }, [dispatch, currentUser.email]);
  return (
    <div className="home">
      <NavBar />
      <Featured />
      <List title={"Movies"} />
      <List title={"Shows"} />
      <Footer />
    </div>
  );
};

export default Home;
