import {lazy, Suspense, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from "react-router-dom";
import axios from "axios";
import ErrorBoundary from "./Components/ErrorBoundary";
import {logout, setAuthStatus} from "./redux/userSlice";
import {persistor} from "./redux/store";
import {fetchCurrentUserDetails} from "./Network/ApiCalls";
import {clearAuth, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken} from "./authStore";

import Home from "./Pages/User/Home";
import NotFound from "./Pages/User/NotFound";
import NavBar from "./Components/NavBar";
import Sidebar from "./Components/Sidebar";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminProtectedRoute from "./Components/Admin/AdminProtectedRoute";
import Fallback from "./Utils/FallBackPage";
import ServerConnection from "./Utils/ServerConnection";

const LoginForm = lazy(() => import("./Pages/User/LoginForm"));
const RegistrationForm = lazy(() => import("./Pages/User/RegistrationForm"));
const ForgotPassword = lazy(() => import("./Pages/User/ForgotPassword"));
const Detail = lazy(() => import("./Pages/User/Detail"));
const UserSettings = lazy(() => import("./Pages/User/Settings"));
const Subscription = lazy(() => import("./Pages/User/Subscription"));
const EmailVerification = lazy(() => import("./Pages/User/EmailVerification"));
const VideoFullScreen = lazy(() => import("./Pages/User/VideoFullScreen"));
const AboutUs = lazy(() => import("./Pages/User/AboutUs"));
const Movies = lazy(() => import("./Pages/User/Movies"));
const Shows = lazy(() => import("./Pages/User/Shows"));
const Watchlist = lazy(() => import("./Pages/User/Watchlist"));
const Liked = lazy(() => import("./Pages/User/Liked"));
const Profile = lazy(() => import("./Pages/User/Profile"));

const PaymentCheckout = lazy(() => import("./Pages/Payment/PaymentCheckout"));
const Success = lazy(() => import("./Pages/Payment/Success"));

const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const ContentManagerLogin = lazy(() => import("./Pages/Admin/ContentManagerLogin"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const UserList = lazy(() => import("./Pages/Admin/UserList"));
const NewUser = lazy(() => import("./Pages/Admin/NewUser"));
const UserEdit = lazy(() => import("./Pages/Admin/UserEdit"));
const MovieList = lazy(() => import("./Pages/Admin/MovieList"));
const NewMovie = lazy(() => import("./Pages/Admin/NewMovie"));
const MovieEdit = lazy(() => import("./Pages/Admin/MovieEdit"));
const ShowList = lazy(() => import("./Pages/Admin/ShowList"));
const NewShow = lazy(() => import("./Pages/Admin/NewShow"));
const ShowEdit = lazy(() => import("./Pages/Admin/ShowEdit"));
const AdminList = lazy(() => import("./Pages/Admin/AdminList"));
const NewAdmin = lazy(() => import("./Pages/Admin/NewAdmin"));
const AdminEdit = lazy(() => import("./Pages/Admin/AdminEdit"));
const ContentManagerList = lazy(() => import("./Pages/Admin/ContentManagerList"));
const NewContentManager = lazy(() => import("./Pages/Admin/NewContentManager"));
const ContentManagerEdit = lazy(() => import("./Pages/Admin/ContentManagerEdit"));
const Settings = lazy(() => import("./Pages/Admin/Settings"));
const SetPassword = lazy(() => import("./Pages/Admin/SetPassword"));

const isLocalHost = () =>
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const getBaseURL = () => {
    if (isLocalHost()) return process.env.REACT_APP_API_URL || 'http://localhost:8081';
    return process.env.REACT_APP_API_URL || 'https://nmoviesapi.duckdns.org';
};

const API_URL = getBaseURL();

const RouteFallback = () => (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-[#8892b0] text-sm">Loading page...</div>
    </div>
);

function ServerStatusBanner() {
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const check = async () => {
            try {
                await axios.get(`${API_URL}/api/v1/ping`, {timeout: 5000});
                if (!cancelled) setOffline(false);
            } catch {
                if (!cancelled) setOffline(true);
            }
        };
        check();
        const id = setInterval(check, 10000);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    if (!offline) return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-[100] glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl animate-fade-in max-w-[320px]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0"/>
            <div className="text-xs">
                <p className="m-0 text-white font-semibold">Server is starting up</p>
                <p className="m-0 text-[#5a6380]">Retrying automatically…</p>
            </div>
        </div>
    );
}

function AppWithNavigation() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Initializing authentication flow...');
            const refreshToken = getRefreshToken();
            const accessToken = getAccessToken();

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_URL}/api/v1/auth/refresh-token`,
                        {refreshToken},
                        {headers: {'Content-Type': 'application/json'}}
                    );

                    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = response.data;

                    setAccessToken(newAccessToken);
                    if (newRefreshToken) {
                        setRefreshToken(newRefreshToken);
                    }

                    dispatch(setAuthStatus('authenticated'));
                    await fetchCurrentUserDetails(dispatch);
                    console.log('Auth status updated to authenticated');
                } catch (error) {
                    console.warn('Token refresh failed:', error.message);
                    clearAuth();
                    dispatch(logout());
                    persistor.purge();
                    console.log('Auth flow: tokens cleared and logged out');
                }
            } else if (accessToken) {
                try {
                    await fetchCurrentUserDetails(dispatch);
                    dispatch(setAuthStatus('authenticated'));
                    console.log('Auth status updated to authenticated via existing access token');
                } catch (error) {
                    console.warn('Access token invalid:', error.message);
                    clearAuth();
                    dispatch(logout());
                    persistor.purge();
                    console.log('Auth flow: tokens cleared due to invalid access token');
                }
            } else {
                dispatch(setAuthStatus('unauthenticated'));
                console.log('Auth status set to unauthenticated');
            }
        };

        initializeAuth();

    }, [dispatch]);

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'accessToken' && !e.newValue) {
                clearAuth();
                dispatch(logout());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [dispatch]);

    useEffect(() => {
        window.paymentSuccess = () => {
            fetchCurrentUserDetails(dispatch);
        };

        return () => {
            window.paymentSuccess = null;
        };
    }, [dispatch]);

    return (
        <>
            <Router>
                <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            </Router>
            <ServerStatusBanner/>
        </>
    );
}

function Layout({sidebarOpen, setSidebarOpen}) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isVideoPage = location.pathname.startsWith('/video');

    // Admin layout
    if (isAdminRoute) {
        return (
            <Suspense fallback={<RouteFallback/>}>
                <Routes>
                    {/* Admin login pages (no layout shell) */}
                    <Route path="/admin/login" element={<AdminLogin/>}/>
                    <Route path="/admin/cm-login" element={<ContentManagerLogin/>}/>
                    <Route path="/admin/set-password" element={<SetPassword/>}/>

                    {/* Admin pages with layout */}
                    <Route path="/admin/*" element={
                        <AdminProtectedRoute>
                            <AdminLayout/>
                        </AdminProtectedRoute>
                    }>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path="users" element={<UserList/>}/>
                        <Route path="users/new" element={<NewUser/>}/>
                        <Route path="users/edit/:id" element={<UserEdit/>}/>
                        <Route path="movies" element={<MovieList/>}/>
                        <Route path="movies/new" element={<NewMovie/>}/>
                        <Route path="movies/edit/:id" element={<MovieEdit/>}/>
                        <Route path="shows" element={<ShowList/>}/>
                        <Route path="shows/new" element={<NewShow/>}/>
                        <Route path="shows/edit/:id" element={<ShowEdit/>}/>
                        <Route path="admins" element={<AdminList/>}/>
                        <Route path="admins/new" element={<NewAdmin/>}/>
                        <Route path="admins/edit/:id" element={<AdminEdit/>}/>
                        <Route path="content-managers" element={<ContentManagerList/>}/>
                        <Route path="content-managers/new" element={<NewContentManager/>}/>
                        <Route path="content-managers/edit/:id" element={<ContentManagerEdit/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace/>}/>
                    </Route>

                    {/* Catch all for admin */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace/>}/>
                </Routes>
            </Suspense>
        );
    }

    // User layout
    return (
        <>
            {!isVideoPage && <NavBar onMenuClick={() => setSidebarOpen(true)}/>}
            {!isVideoPage && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>}
            <Suspense fallback={<RouteFallback/>}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/server-status" element={<ServerConnection/>}/>
                    <Route path="/fallback" element={<Fallback/>}/>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/register" element={<RegistrationForm/>}/>
                    <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/movies" element={<Movies/>}/>
                    <Route path="/shows" element={<Shows/>}/>
                    <Route path="/movie/:id" element={<Detail/>}/>
                    <Route path="/show/:id" element={<Detail/>}/>

                    {/* Protected Routes - Require Authentication */}
                    <Route
                        path="/watchlist"
                        element={
                            <ProtectedRoute>
                                <Watchlist/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/liked"
                        element={
                            <ProtectedRoute>
                                <Liked/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/email-verification" element={<EmailVerification/>}/>
                    <Route path="/payment" element={<PaymentCheckout/>}/>
                    <Route path="/payment/success" element={<Success/>}/>
                    <Route path="/payment/:userId" element={<PaymentCheckout/>}/>
                    <Route path="/success" element={<Success/>}/>

                    {/* Protected Routes - Require Subscription */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <UserSettings/>
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Routes - Require Subscription */}
                    <Route
                        path="/subscription"
                        element={
                            <Subscription/>
                        }
                    />

                    {/* Protected Routes - Require Authentication and Subscription */}
                    <Route
                        path="/video/:id"
                        element={
                            <ProtectedRoute requireSubscription redirectToRegister>
                                <VideoFullScreen/>
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirects */}
                    <Route path="/registerAdmin" element={<Navigate to="/" replace/>}/>

                    {/* Catch all */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </>
    );
}

// protected route component

function ProtectedRoute({
                            children,
                            requireSubscription = false,
                            redirectToRegister = false
                        }) {
    const authStatus = useSelector(state => state.user.authStatus);
    const currentUser = useSelector(state => state.user.currentUser);

    if (authStatus === 'loading') {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                <div className="text-[#8892b0] text-sm">Loading...</div>
            </div>
        );
    }

    if (authStatus !== 'authenticated') {
        console.log('ProtectedRoute: User not authenticated, redirecting');
        return (
            <Navigate
                to={redirectToRegister ? "/register" : "/login"}
                replace
            />
        );
    }

    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

    if (requireSubscription && isAdmin) {
        return children;
    }

    if (requireSubscription && !currentUser?.isSubscribed) {
        return <Navigate to="/subscription" replace/>;
    }

    return children;
}

export default function App() {
    return (
        <ErrorBoundary>
            <AppWithNavigation/>
        </ErrorBoundary>
    );
}
