import Home from "./Pages/Home";
import "./App.css";
import AboutUs from "./Pages/AboutUs";
import Movies from "./Pages/Movies";
import Shows from "./Pages/Shows";
import VideoFullScreen from "./Pages/VideoFullScreen";

import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";

function AppWithNavigation() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/movies" element={<Movies/>}/>
                    <Route path="/shows" element={<Shows/>}/>
                    <Route path="/vfs" element={<VideoFullScreen/>}/>
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return <AppWithNavigation/>;
}

export default App;
