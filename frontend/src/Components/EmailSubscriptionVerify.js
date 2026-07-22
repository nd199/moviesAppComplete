import { Send, Mail, VerifiedUser } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';
import { validateSubscriptionOtp, verifySubscriptionEmail } from '../Network/ApiCalls';
import { resetErrorMessage } from '../redux/userSlice';
import CrossMark from '../Utils/animations/CrossMark.json';
import TickMark from '../Utils/animations/TickMark.json';

const EmailSubscriptionVerify = ({ onEmailUpdate, onEmailVerified, onEmailError }) => {
  const [email, setEmail] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const currEmail = useSelector(s => s?.user?.currentUser?.email);
  const otpRefs = useRef([]);

  useEffect(() => () => { dispatch(resetErrorMessage()); setMsg(''); setError(''); setShowOtp(false); }, [dispatch]);
  useEffect(() => { onEmailUpdate(email); }, [email, onEmailUpdate]);
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  // Auto-focus first OTP input
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

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (otpString.length === 6 && validOtp(otpString)) {
      setTimeout(() => verifyOtpWith(otpString), 100);
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
        setTimeout(() => verifyOtpWith(pasted), 100);
      }
    }
  };

  const sendOtp = async () => {
    setSending(true);
    try {
      setShowVerify(false); setShowOtp(true);
      const r = await verifySubscriptionEmail(dispatch, email);
      setMsg(r); setTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const verifyOtpWith = async (otp) => {
    if (timer <= 0 && otp) { setError('OTP expired. Please resend.'); setShowVerify(true); setShowOtp(false); setOtpDigits(['', '', '', '', '', '']); setEmail(''); return; }
    setVerifying(true);
    try {
      const r = await validateSubscriptionOtp(dispatch, otp, email);
      setMsg(r); setShowOtp(false); setError('');
      if (r === 'OTP verified successfully') { setDisabled(true); onEmailVerified(true); }
    } catch (err) {
      setShowOtp(false); setMsg(err?.response?.data); setError(err?.response?.data + ' Please re-enter your email.'); setOtpDigits(['', '', '', '', '', '']); setEmail(''); onEmailVerified(false);
    } finally { setVerifying(false); }
  };

  const resendOtp = () => {
    setOtpDigits(['', '', '', '', '', '']);
    sendOtp();
  };

  const emailMatch = validEmail(email) && email === currEmail;
  const emailMismatch = validEmail(email) && email !== currEmail;

  return (
    <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-5">
      {/* Email input */}
      <div>
        <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider mb-2 block">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568]" sx={{ fontSize: 18 }} />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            disabled={disabled}
            onChange={e => {
              const v = e.target.value.toLowerCase(); setEmail(v);
              if (validEmail(v)) {
                if (v === currEmail) { setShowVerify(true); onEmailError(''); }
                else { onEmailError('Email does not match your account'); setShowVerify(false); }
              }
              else { setShowVerify(false); onEmailError(''); }
              setMsg('');
            }}
            className="w-full glass rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all disabled:opacity-50"
          />
          {emailMatch && <VerifiedUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400" sx={{ fontSize: 18 }} />}
        </div>
        {emailMismatch && (
          <p className="text-amber-400 text-[0.7rem] mt-1.5 m-0">This email doesn't match your registered account</p>
        )}
      </div>

      {/* Send OTP button */}
      {showVerify && !showOtp && (
        <button type="button" onClick={sendOtp} disabled={!validEmail(email) || sending}
          className="btn-primary text-sm !py-3 rounded-xl flex items-center justify-center gap-2 animate-fade-in">
          {sending ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
          ) : (
            <><Send sx={{ fontSize: 16 }} /> Send Verification Code</>
          )}
        </button>
      )}

      {/* OTP Input */}
      {showOtp && (
        <div className="animate-fade-in">
          <label className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider mb-2 block">
            Enter 6-Digit Code
          </label>

          {/* OTP digit boxes */}
          <div className="flex items-center justify-center gap-2 mb-3">
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
                className="w-11 h-12 rounded-xl glass text-center text-white text-lg font-bold placeholder:text-[#2a3350] focus:outline-none focus:border-brand-500/50 focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all disabled:opacity-50"
                style={{ caretColor: '#7c3aed' }}
              />
            ))}
          </div>

          {/* Timer and resend */}
          <div className="flex items-center justify-between">
            {verifying ? (
              <div className="flex items-center gap-2 text-[0.75rem] text-brand-300">
                <span className="w-3 h-3 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
                Verifying...
              </div>
            ) : timer > 0 ? (
              <span className="text-[#5a6380] text-[0.75rem]">
                Resend in{' '}
                <span className="text-brand-300 font-medium font-mono">
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </span>
              </span>
            ) : (
              <button type="button" onClick={resendOtp}
                className="text-brand-300 text-[0.75rem] font-medium hover:text-brand-200 transition-colors bg-transparent border-none cursor-pointer p-0">
                Resend Code
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success/Error messages */}
      {(msg === 'OTP verified successfully' || (msg && msg.toLowerCase().includes('otp sent'))) && !error && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-fade-in">
          <Lottie options={tick} style={{ width: 28, height: 28, flexShrink: 0 }} />
          <span className="text-emerald-400 text-sm font-medium">{msg === 'OTP verified successfully' ? 'Email verified successfully!' : msg}</span>
        </div>
      )}
      {(error || (msg && msg !== 'OTP verified successfully' && !msg.toLowerCase().includes('otp sent'))) && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
          <Lottie options={cross} style={{ width: 28, height: 28, flexShrink: 0 }} />
          <span className="text-red-400 text-sm">{error || msg}</span>
        </div>
      )}
    </form>
  );
};

export default EmailSubscriptionVerify;
