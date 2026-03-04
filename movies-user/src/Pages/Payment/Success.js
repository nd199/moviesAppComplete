import TickMark from "../../animations/TickMark.json";
import Lottie from "react-lottie";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSuccess } from "../../redux/userSlice";
import { markUserSubscribedApi } from "../../Network/ApiCalls";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const paymentData = location.state?.paymentData;
  const [countdown, setCountdown] = useState(5);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (updated || !currentUser?.email) return;

    const markUserAsSubscribed = async () => {
      try {
        const response = await markUserSubscribedApi();
        
        if (response.data) {
          dispatch(updateUserSuccess(response.data));
        }
        
        setUpdated(true);
      } catch (error) {
        console.error('Failed to mark user as subscribed:', error);
        setUpdated(true);
      }
    };

    markUserAsSubscribed();
  }, [dispatch, updated, currentUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000); 
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const TickMarkOptions = {
    loop: true,
    autoplay: true,
    animationData: TickMark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
        color: "white",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <Lottie options={TickMarkOptions} style={{ width: 220, height: 220 }} />
      <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "16px", color: "#4CAF50" }}>
        Payment Successful!
      </h1>
      
      {paymentData && (
        <div style={{ maxWidth: "600px", marginBottom: "24px" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#b3b3b3" }}>
            Thank you for your subscription!
          </p>
          
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "20px", 
            borderRadius: "12px", 
            marginBottom: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h3 style={{ color: "#ffffff", marginBottom: "12px" }}>Order Details:</h3>
            <p style={{ color: "#b3b3b3", margin: "8px 0" }}>
              <strong>Plan:</strong> {paymentData.plan?.name}
            </p>
            <p style={{ color: "#b3b3b3", margin: "8px 0" }}>
              <strong>Price:</strong> ₹{paymentData.plan?.price}
            </p>
            <p style={{ color: "#b3b3b3", margin: "8px 0" }}>
              <strong>Transaction ID:</strong> {paymentData.transactionId}
            </p>
          </div>
          
          <p style={{ fontSize: "0.9rem", color: "#888888" }}>
            Redirecting to home page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
          </p>
          
          <button 
            onClick={() => {
              console.log('Success: Manual redirect triggered');
              navigate("/");
            }}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Home Page Now
          </button>
        </div>
      )}
      
      {!paymentData && (
        <div>
          <p style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#b3b3b3" }}>
            Thank you for your subscription!
          </p>
          <p style={{ fontSize: "0.9rem", color: "#888888" }}>
            Redirecting to home page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
          </p>
          
          <button 
            onClick={() => {
              console.log('Success: Manual redirect triggered (no payment data)');
              navigate("/");
            }}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Home Page Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;