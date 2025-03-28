import Home from "./Pages/Home";
import "./App.css";
import AboutUs from "./Pages/AboutUs";
import Movies from "./Pages/Movies";
import Shows from "./Pages/Shows";
import VideoFullScreen from "./Pages/VideoFullScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./Pages/RegistrationForm";
import { useSelector } from "react-redux";
import LoginForm from "./Pages/LoginForm";
import Subscription from "./Pages/Subscription";
import EmailVerification from "./Pages/EmailVerification";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import { useEffect, useState } from "react";
import axios from "axios";
import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

function AppWithHealthCheck() {
  const [backendStatus, setBackendStatus] = useState("loading");

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get(
        "https://movieticket-api.onrender.com/ping"
      );
      if (response.status === 200 && response.data === "Pong") {
        setBackendStatus("Up");
      } else {
        setBackendStatus("Down");
      }
    } catch (err) {
      setBackendStatus("Down");
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      await checkBackendStatus();
    };
    checkStatus();
    const interval = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (backendStatus === "loading") {
    return <ServerConnection />;
  }

  if (backendStatus === "Down") {
    return <Fallback />;
  }

  return <AppWithNavigation />;
}

function AppWithNavigation() {
  const user = useSelector((state) => state?.user);
  const currentUser = user?.currentUser;
  const isRegistered = currentUser?.isRegistered || false;
  const isLoggedIn = currentUser?.isLogged || false;
  const isSubscribed = currentUser?.isSubscribed || false;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isRegistered ? <Home /> : <RegistrationForm />}
          />
          <Route
            path="/Login"
            element={isLoggedIn ? <Home /> : <LoginForm />}
          />
          <Route
            path="/about"
            element={isLoggedIn || isRegistered ? <AboutUs /> : <LoginForm />}
          />
          <Route
            path="/movies"
            element={isLoggedIn || isRegistered ? <Movies /> : <LoginForm />}
          />
          <Route
            path="/shows"
            element={isLoggedIn || isRegistered ? <Shows /> : <LoginForm />}
          />
          <Route
            path="/vfs"
            element={isSubscribed ? <VideoFullScreen /> : <Subscription />}
          />
          <Route
            path="/email-verification"
            element={
              isLoggedIn || isRegistered ? <EmailVerification /> : <LoginForm />
            }
          />
          <Route
            path="/subscribe"
            element={isSubscribed ? <Home /> : <Subscription />}
          />
          <Route
            path="/subscribe"
            element={
              isLoggedIn || isRegistered ? <Subscription /> : <LoginForm />
            }
          />
          <Route
            path="/profile"
            element={isLoggedIn || isRegistered ? <Profile /> : <LoginForm />}
          />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return <AppWithHealthCheck />;
}

export default App;
