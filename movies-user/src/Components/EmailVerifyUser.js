import { Send } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';
import { validateOtp, verifyEmail } from '../Network/ApiCalls';
import { resetErrorMessage } from '../redux/userSlice';
import CrossMark from '../Utils/animations/CrossMark.json';
import TickMark from '../Utils/animations/TickMark.json';
import './EmailVerifyUser.css';

const EmailVerifyUser = ({ onEmailVerified }) => {
  const [email, setEmail] = useState('');
  const [showVerifyBtn, setShowVerifyBtn] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);

  const dispatch = useDispatch();
  const serverError = useSelector(state => state?.user?.errorMessage?.message);

  useEffect(() => () => dispatch(resetErrorMessage()), [dispatch]);
  useEffect(() => {
    if (!showOtpInput || otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showOtpInput, otpTimer]);

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidOtp = otp => /^[0-9]{6}$/.test(otp);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) return;
    setIsSending(true);
    try {
      await verifyEmail(dispatch, email);
      setShowOtpInput(true);
      setOtpTimer(60);
      setOtpMessage('');
    } catch (err) {
      console.error(err);
      setOtpMessage('Failed to send OTP');
    } finally {
      setIsSending(false);
      setShowVerifyBtn(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isValidOtp(otp)) return;
    setIsVerifying(true);
    try {
      const res = await validateOtp(dispatch, {
        customerEmail: email,
        enteredOTP: otp,
      });
      setOtpMessage(res);
      if (res === 'OTP verified successfully') {
        setIsEmailDisabled(true);
        setShowOtpInput(false);
        onEmailVerified(email);
      }
    } catch (err) {
      console.error(err);
      setOtpMessage('Invalid OTP or OTP expired');
      onEmailVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const TickOptions = {
    loop: true,
    autoplay: true,
    animationData: TickMark,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };
  const CrossOptions = {
    loop: true,
    autoplay: true,
    animationData: CrossMark,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  return (
    <div className="inputs">
      <label>Email:</label>
      <div className="email-input-wrapper">
        <input
          type="email"
          value={email}
          placeholder="your@email.com"
          onChange={e => {
            setEmail(e.target.value.toLowerCase());
            setShowVerifyBtn(e.target.value.length > 1 && !isEmailDisabled);
            setOtpMessage('');
            setShowOtpInput(false);
          }}
          disabled={isEmailDisabled}
        />
        {otpMessage === 'OTP verified successfully' ? (
          <Lottie options={TickOptions} style={{ width: 40, height: 40 }} />
        ) : otpMessage === 'Invalid OTP or OTP expired' ? (
          <Lottie options={CrossOptions} style={{ width: 40, height: 40 }} />
        ) : null}
      </div>

      {showVerifyBtn && (
        <button
          onClick={handleSendOtp}
          disabled={!isValidEmail(email) || isSending}>
          {isSending ? 'Sending...' : 'Verify Email'}
        </button>
      )}

      {showOtpInput && (
        <div className="otp-container">
          <input
            type="text"
            value={otp}
            maxLength={6}
            placeholder="Enter OTP"
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          />
          <button
            onClick={handleVerifyOtp}
            disabled={!isValidOtp(otp) || isVerifying}>
            <Send />
          </button>
          <p>{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</p>
        </div>
      )}

      {otpMessage && (
        <p
          className={
            otpMessage === 'OTP verified successfully'
              ? 'otp-message'
              : 'otp-message-error'
          }>
          {otpMessage}
        </p>
      )}
      {serverError && <p className="otp-message">{serverError}</p>}
    </div>
  );
};

export default EmailVerifyUser;
