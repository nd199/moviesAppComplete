import React, {useEffect} from "react";
import "./Home.css";
import NavBar from "../Components/NavBar";
import Featured from "../Components/Featured";
import List from "../Components/List";
import Footer from "../Components/Footer";
import axios from "axios";

const Home = () => {


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/nwtChk");
                console.log(response);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);


    return (
        <div className="home">
            <NavBar/>
            <Featured type={"series"}/>
            <List/>
            <List/>
            <List/>
            <Footer/>
        </div>
    );
};

export default Home;
