import { Send, Mail, VerifiedUser } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';
import { validateOtp, verifyEmail } from '../Network/ApiCalls';
import { resetErrorMessage } from '../redux/userSlice';
import CrossMark from '../Utils/animations/CrossMark.json';
import TickMark from '../Utils/animations/TickMark.json';

const EmailVerifyUser = ({ onEmailVerified, isForSubscription = false }) => {
  const [email, setEmail] = useState('');
  const [showBtn, setShowBtn] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const serverErr = useSelector(s => s?.user?.errorMessage?.message);
  const otpRefs = useRef([]);

  useEffect(() => () => dispatch(resetErrorMessage()), [dispatch]);
  useEffect(() => {
    if (!showOtp || timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [showOtp, timer]);

  useEffect(() => {
    if (showOtp && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [showOtp]);

  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validOtp = (o) => /^\d{6}$/.test(o);
  const tick = { loop: true, autoplay: true, animationData: TickMark, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
  const cross = { loop: true, autoplay: true, animationData: CrossMark, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    const otpString = newDigits.join('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (otpString.length === 6 && validOtp(otpString)) {
      setTimeout(() => verifyWith(otpString), 100);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtpDigits(newDigits);
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
      if (pasted.length === 6) {
        setTimeout(() => verifyWith(pasted), 100);
      }
    }
  };

  const sendOtp = async () => {
    if (!validEmail(email)) return;
    setSending(true); setMsg(''); setShowOtp(false); setOtpDigits(['', '', '', '', '', '']);
    try {
      const r = await verifyEmail(dispatch, email, !isForSubscription);
      if (!isForSubscription && r?.exists) { setMsg('Email already registered.'); setShowOtp(false); setDisabled(true); }
      else { setShowOtp(true); setTimer(60); }
    } catch (err) {
      if (err.response?.status === 409) { setMsg(err.response.data.message || 'Already registered.'); setDisabled(true); }
      else setMsg('Failed to send OTP.');
    } finally { setSending(false); }
  };

  const verifyWith = async (otpVal) => {
    if (!validOtp(otpVal)) return;
    setVerifying(true);
    try {
      const r = await validateOtp(dispatch, otpVal, email);
      setMsg(r || 'Verified');
      if (r?.includes('success')) { setDisabled(true); setShowOtp(false); onEmailVerified(email); }
    } catch { setMsg('Invalid OTP'); onEmailVerified(false); }
    finally { setVerifying(false); }
  };

  const resendOtp = () => {
    setOtpDigits(['', '', '', '', '', '']);
    sendOtp();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider">Email</label>
      <div className="relative">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568]" sx={{ fontSize: 18 }} />
        <input type="email" value={email} placeholder="your@email.com" disabled={disabled}
          onChange={e => { setEmail(e.target.value.toLowerCase()); setShowBtn(e.target.value.length > 1 && !disabled); setMsg(''); setShowOtp(false); }}
          className={`w-full h-[50px] pl-10 pr-10 rounded-xl glass border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed`} />
        {msg === 'OTP verified successfully' && <VerifiedUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400" sx={{ fontSize: 18 }} />}
      </div>

      {/* Send OTP */}
      {showBtn && !showOtp && !disabled && (
        <button type="button" onClick={sendOtp} disabled={!validEmail(email) || sending}
          className="w-full h-[42px] rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2 animate-fade-in">
          {sending ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
          ) : (
            <><Send sx={{ fontSize: 14 }} /> Send Verification Code</>
          )}
        </button>
      )}

      {/* OTP digit boxes */}
      {showOtp && (
        <div className="animate-fade-in flex flex-col gap-2">
          <div className="flex items-center justify-center gap-1.5">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                disabled={verifying}
                className="w-9 h-10 rounded-lg glass text-center text-white text-sm font-bold placeholder:text-[#2a3350] focus:outline-none focus:border-brand-500/50 transition-all disabled:opacity-50"
                style={{ caretColor: '#7c3aed' }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            {verifying ? (
              <div className="flex items-center gap-1.5 text-[0.7rem] text-brand-300">
                <span className="w-2.5 h-2.5 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
                Verifying...
              </div>
            ) : timer > 0 ? (
              <span className="text-[#5a6380] text-[0.7rem]">
                Resend in <span className="text-brand-300 font-medium font-mono">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
              </span>
            ) : (
              <button type="button" onClick={resendOtp}
                className="text-brand-300 text-[0.7rem] font-medium hover:text-brand-200 transition-colors bg-transparent border-none cursor-pointer p-0">
                Resend Code
              </button>
            )}
          </div>
        </div>
      )}

      {/* Status messages */}
      {(msg === 'OTP verified successfully' || (msg && msg.toLowerCase().includes('otp sent'))) && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-fade-in">
          <Lottie options={tick} style={{ width: 20, height: 20, flexShrink: 0 }} />
          <span className="text-emerald-400 text-xs font-medium">{msg === 'OTP verified successfully' ? 'Verified!' : msg}</span>
        </div>
      )}
      {msg && msg !== 'OTP verified successfully' && !msg.toLowerCase().includes('otp sent') && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
          <Lottie options={cross} style={{ width: 20, height: 20, flexShrink: 0 }} />
          <span className="text-red-400 text-xs">{msg}</span>
        </div>
      )}
      {serverErr && <p className="text-red-400 text-xs m-0">{serverErr}</p>}
    </div>
  );
};

export default EmailVerifyUser;
