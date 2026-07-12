import TickMark from "../../animations/TickMark.json";
import Lottie from "react-lottie";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSuccess } from "../../redux/userSlice";
import { markUserAsSubscribed } from "../../Network/ApiCalls";

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
    const mark = async () => {
      try { const res = await markUserAsSubscribed(); if (res.data) dispatch(updateUserSuccess(res.data)); } catch {}
      setUpdated(true);
    };
    mark();
  }, [dispatch, updated, currentUser]);

  useEffect(() => {
    const timeout = setTimeout(() => navigate("/"), 5000);
    const interval = setInterval(() => setCountdown(p => { if (p <= 1) { clearInterval(interval); return 0; } return p - 1; }), 1000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [navigate]);

  const tickOpts = { loop: true, autoplay: true, animationData: TickMark, rendererSettings: { preserveAspectRatio: "xMidYMid slice" } };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col bg-surface-950 text-white text-center p-5 box-border">
      <Lottie options={tickOpts} style={{ width: 'min(220px, 50vw)', height: 'min(220px, 50vw)' }} />
      <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-semibold mb-4 text-green-500 m-0">Payment Successful!</h1>

      {paymentData && (
        <div className="max-w-[600px] mb-6">
          <p className="text-xl mb-3 text-[#8892b0] m-0">Thank you for your subscription!</p>
          <div className="glass rounded-2xl p-5 mb-4">
            <h3 className="text-white mb-3 m-0">Order Details:</h3>
            <p className="text-[#8892b0] my-2 m-0"><strong>Plan:</strong> {paymentData.plan?.name}</p>
            <p className="text-[#8892b0] my-2 m-0"><strong>Price:</strong> ₹{paymentData.plan?.price}</p>
            <p className="text-[#8892b0] my-2 m-0"><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
          </div>
          <p className="text-sm text-[#5a6380] m-0">Redirecting to home page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...</p>
          <button onClick={() => navigate("/")} className="btn-primary mt-4">Go to Home Page Now</button>
        </div>
      )}

      {!paymentData && (
        <div>
          <p className="text-xl mb-4 text-[#8892b0] m-0">Thank you for your subscription!</p>
          <p className="text-sm text-[#5a6380] m-0">Redirecting to home page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...</p>
          <button onClick={() => navigate("/")} className="btn-primary mt-4">Go to Home Page Now</button>
        </div>
      )}
    </div>
  );
};

export default Success;
