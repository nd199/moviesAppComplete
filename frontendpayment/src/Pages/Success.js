import TickMark from "../animations/TickMark.json";
import Lottie from "react-lottie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("https://movies-app-complete.vercel.app")
    }, 1000);
    return () => clearTimeout(timeout);
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
      }}
    >
      <Lottie options={TickMarkOptions} style={{ width: 220, height: 220 }} />
      <p>Payment Successful</p>
    </div>
  );
};

export default Success;