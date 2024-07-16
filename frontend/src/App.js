import Home from "./Pages/Home";
import "./App.css";
import AboutUs from "./Pages/AboutUs";
import Movies from "./Pages/Movies";
import Shows from "./Pages/Shows";
import VideoFullScreen from "./Pages/VideoFullScreen";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import RegistrationForm from "./Pages/RegistrationForm";
import {useSelector} from "react-redux";
import LoginForm from "./Pages/LoginForm";
import Subscription from "./Pages/Subscription";
import EmailVerification from "./Pages/EmailVerification";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";

function AppWithNavigation() {
    const user = useSelector((state) => state?.user);
    const currentUser = user?.currentUser;
    const isRegistered = currentUser?.isRegistered || false;
    const isLoggedIn = currentUser?.isLogged || false;

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={isRegistered ? <Home/> : <RegistrationForm/>}
                    />
                    <Route
                        path="/Login"
                        element={isLoggedIn ? <Home/> : <LoginForm/>}
                    />
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/movies" element={<Movies/>}/>
                    <Route path="/shows" element={<Shows/>}/>
                    <Route path="/vfs" element={<VideoFullScreen/>}/>
                    <Route path="/email-verification" element={<EmailVerification/>}/>
                    <Route path="/subscribe" element={<Subscription/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return <AppWithNavigation/>;
}

export default App;
