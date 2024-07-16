import TickMark from "../animations/TickMark.json";
import Lottie from "react-lottie";
import {useEffect} from "react";

const Success = () => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.location.href = "http://localhost:3000";
        }, 1000)
        return () => clearTimeout(timeout);
    }, []);

    const TickMarkOptions = {
        loop: true,
        autoplay: true,
        animationData: TickMark,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return <div style={{
        width: '100%',
        height: '100vh',
        objectFit: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    }}>
        <Lottie
            options={TickMarkOptions}
            style={{width: "220px", height: "220px"}}
            title="OTP verified successfully"
        />
        <p>Payment SuccessFull</p>

    </div>;
}

export default Success;