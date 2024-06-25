import Home from "./Pages/Home";
import "./App.css";
import AboutUs from "./Pages/AboutUs";
import Movies from "./Pages/Movies";
import Shows from "./Pages/Shows";
import VideoFullScreen from "./Pages/VideoFullScreen";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./Pages/RegistrationForm";
import { useSelector } from "react-redux";

function AppWithNavigation() {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user?.currentUser?.isLogged || false;
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <RegistrationForm />}
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/vfs" element={<VideoFullScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return <AppWithNavigation />;
}

export default App;
