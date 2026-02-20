import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      setError("");
    };
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");
    
    dispatch(loginStart());
    
    try {
      const response = await authService.login({ 
        username, 
        password 
      });
      
      // Dispatch success action with admin data
      dispatch(loginSuccess({ 
        admin: response.user 
      }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error: ", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center m-0 p-0 overflow-scroll font-['Roboto', 'sans-serif']" 
         style={{
           background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/REGBack.jpg") no-repeat center center',
           backgroundSize: 'cover'
         }}>
      <div className="flex flex-col items-center justify-center bg-black bg-opacity-70 p-10 gap-5 rounded-lg shadow-lg max-w-full w-[400px] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="text-center">
          <h1 className="text-white text-2xl font-normal mb-2" style={{ fontSize: '32px', fontWeight: '400', marginBottom: '10px' }}>Welcome Admin</h1>
          <h4 className="text-white text-lg font-light" style={{ fontSize: '18px', fontWeight: '300', marginBottom: '20px' }}>Please Login below</h4>
        </div>
        <form onSubmit={loginHandler} className="w-full flex flex-col justify-center gap-4">
          <div className="flex flex-col w-full gap-1">
            <label className="text-white text-lg font-semibold" style={{ fontSize: '18px', fontWeight: '600' }}>EMAIL :</label>
            <input
              type="email"
              placeholder="Cena@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              className="p-2.5 border-none rounded-lg text-base transition-all duration-300"
              style={{
                fontSize: '17px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff'
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-white text-lg font-semibold" style={{ fontSize: '18px', fontWeight: '600' }}>PASSWORD :</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2.5 border-none rounded-lg text-base transition-all duration-300"
              style={{
                fontSize: '17px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff'
              }}
            />
          </div>
          {error && <div className="ml-8 text-red-500 text-sm" style={{ fontSize: '15px' }}>{error}</div>}
          <button 
            type="submit" 
            className="w-full py-3 text-white border-none rounded-lg text-base cursor-pointer transition-all duration-300 mt-2"
            style={{
              fontSize: '16px',
              backgroundColor: '#f46e0ef9',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'red'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f46e0ef9'}
            disabled={loading}
          >
            {loading ? 'L O G G I N G . . .' : 'L O G I N'}
          </button>
        </form>
        <div className="flex items-center justify-between text-white text-sm mt-5 gap-5">
          <p className="text-sm text-white flex-1" style={{ fontSize: '15px' }}>
            New to CN.IO? <br/> Register{" "}
            <Link to="/register">
              <span className="text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer">here</span>
            </Link>
          </p>
        </div>
        {error !== "Profile Not Found, If you are new here consider registering first, else contact us" && (
          <p className="text-white">
            Forgot Password? Click{" "}
            <Link to="/forgotPassword">
              <span className="text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer">here</span>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
