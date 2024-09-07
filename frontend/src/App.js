import Home from "./Pages/Home";
import "./App.css";
import AboutUs from "./Pages/AboutUs";
import Movies from "./Pages/Movies";
import Shows from "./Pages/Shows";
import VideoFullScreen from "./Pages/VideoFullScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./Pages/RegistrationForm";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./Pages/LoginForm";
import Subscription from "./Pages/Subscription";
import EmailVerification from "./Pages/EmailVerification";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import { useEffect } from "react";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";
import ErrorBoundary from "./ErrorBoundary";

function AppWithNavigation() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const currentUser = user?.currentUser;
  const isRegistered = currentUser?.isRegistered || false;
  const isLoggedIn = currentUser?.isLogged || false;
  const isSubscribed = currentUser?.isSubscribed || false;

  return (
    <ErrorBoundary>
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
                isLoggedIn || isRegistered ? (
                  <EmailVerification />
                ) : (
                  <LoginForm />
                )
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
    </ErrorBoundary>
  );
}

function App() {
  return <AppWithNavigation />;
}

export default App;
