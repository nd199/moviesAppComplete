import Navbar from "./components/Navbar";
import SideNav from "./components/SideNav";
import "./App.css";
import Home from "./Pages/Home";
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import UserList from "./Pages/UserList";
import UserInfoAndEdit from "./Pages/UserInfoAndEdit";
import NewUser from "./Pages/NewUser";
import ProductList from "./Pages/ProductList";
import ProductInfoAndEdit from "./Pages/ProductInfoAndEdit";
import NewProduct from "./Pages/NewProduct";
import Login from "./Pages/Login";
import {useSelector} from "react-redux";
import Register from "./Pages/Register";
import ForgotPasswordAdmin from "./Pages/ForgotPasswordAdmin";

function AppContent() {
    const user = useSelector((state) => state.user);
    const isLoggedIn = user?.currentUser?.customerDTO?.isLogged || false;
    console.log(isLoggedIn);

    return (
        <>
            {isLoggedIn && <Navbar/>}
            <div className="container">
                {isLoggedIn && <SideNav/>}
                <Routes>
                    <Route
                        path="/registerAdmin"
                        element={isLoggedIn ? <Navigate to="/Home"/> : <Register/>}
                    />
                    <Route
                        path="/"
                        element={isLoggedIn ? <Navigate to="/Home"/> : <Login/>}
                    />
                    <Route
                        path="/Home"
                        element={isLoggedIn ? <Home/> : <Navigate to="/"/>}
                    />
                    <Route path="/users" element={isLoggedIn ? <UserList/> : <Navigate to="/"/>}/>
                    <Route path="/user/:userId" element={isLoggedIn ? <UserInfoAndEdit/> : <Navigate to="/"/>}/>
                    <Route path="/newUser" element={isLoggedIn ? <NewUser/> : <Navigate to="/"/>}/>
                    <Route path="/products" element={isLoggedIn ? <ProductList/> : <Navigate to="/"/>}/>
                    <Route path="/product/:productId"
                           element={isLoggedIn ? <ProductInfoAndEdit/> : <Navigate to="/"/>}/>
                    <Route path="/newProduct" element={isLoggedIn ? <NewProduct/> : <Navigate to="/"/>}/>
                    <Route path="/forgotPassword" element={<ForgotPasswordAdmin/>}/>
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
}

export default App;
