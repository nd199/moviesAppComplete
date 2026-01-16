import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { fetchCurrentUserDetails } from "./Network/ApiCalls";
import Home from "./Pages/Home";
import LoginForm from "./Pages/LoginForm";
import RegistrationForm from "./Pages/RegistrationForm";
import Subscription from "./Pages/Subscription";
import VideoFullScreen from "./Pages/VideoFullScreen";

function AppWithHealthCheck() {
  return <AppWithNavigation />;
}

function AppWithNavigation() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const isRegistered = currentUser && currentUser?.isRegistered;
  const isSubscribed = currentUser && currentUser?.isSubscribed;
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.token) {
      fetchCurrentUserDetails(dispatch);
    }
  }, [currentUser?.token, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/vfs"
          element={
            isRegistered && isSubscribed ? (
              <VideoFullScreen />
            ) : !isRegistered ? (
              <RegistrationForm />
            ) : (
              <Subscription />
            )
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return <AppWithHealthCheck />;
}

export default App;
