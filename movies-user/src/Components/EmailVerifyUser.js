import { Send } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';
import { validateOtp, verifyEmail } from '../Network/ApiCalls';
import { resetErrorMessage } from '../redux/userSlice';
import CrossMark from '../Utils/animations/CrossMark.json';
import TickMark from '../Utils/animations/TickMark.json';

const inputClass = "flex-1 glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const EmailVerifyUser = ({ onEmailVerified, isForSubscription = false }) => {
  const [email, setEmail] = useState('');
  const [showBtn, setShowBtn] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const serverErr = useSelector(s => s?.user?.errorMessage?.message);

  useEffect(() => () => dispatch(resetErrorMessage()), [dispatch]);
  useEffect(() => {
    if (!showOtp || timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [showOtp, timer]);

  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validOtp = (o) => /^\d{6}$/.test(o);
  const tick = { loop: true, autoplay: true, animationData: TickMark, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
  const cross = { loop: true, autoplay: true, animationData: CrossMark, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };

  const sendOtp = async () => {
    if (!validEmail(email)) return;
    setSending(true); setMsg(''); setShowOtp(false);
    try {
      const r = await verifyEmail(dispatch, email, !isForSubscription);
      if (!isForSubscription && r?.exists) { setMsg('Email already registered.'); setShowOtp(false); setDisabled(true); }
      else { setShowOtp(true); setTimer(60); }
    } catch (err) {
      if (err.response?.status === 409) { setMsg(err.response.data.message || 'Already registered.'); setDisabled(true); }
      else setMsg('Failed to send OTP.');
    } finally { setSending(false); }
  };

  const verify = async () => {
    if (!validOtp(otp)) return;
    setVerifying(true);
    try {
      const r = await validateOtp(dispatch, otp, email);
      setMsg(r || 'Verified');
      if (r?.includes('success')) { setDisabled(true); setShowOtp(false); onEmailVerified(email); }
    } catch { setMsg('Invalid OTP'); onEmailVerified(false); }
    finally { setVerifying(false); }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[#8892b0]">Email</label>
      <div className="flex items-center gap-2">
        <input type="email" value={email} placeholder="your@email.com" disabled={disabled}
          onChange={e => { setEmail(e.target.value.toLowerCase()); setShowBtn(e.target.value.length > 1 && !disabled); setMsg(''); setShowOtp(false); }}
          className={inputClass} />
        {msg === 'OTP verified successfully' && <Lottie options={tick} style={{ width: 32, height: 32 }} />}
        {msg.includes('Invalid') && <Lottie options={cross} style={{ width: 32, height: 32 }} />}
      </div>
      {showBtn && <button onClick={sendOtp} disabled={!validEmail(email) || sending} className="btn-primary text-sm !py-2.5">{sending ? 'Sending...' : 'Verify'}</button>}
      {showOtp && (
        <div className="flex items-center gap-2">
          <input type="text" value={otp} maxLength={6} placeholder="6-digit OTP" onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className={inputClass} />
          <button onClick={verify} disabled={!validOtp(otp) || verifying} className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center !p-0 disabled:opacity-50"><Send sx={{ fontSize: 16 }} /></button>
          <span className="text-[#5a6380] text-xs">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
        </div>
      )}
      {msg && <p className={`text-xs m-0 ${msg.includes('success') || msg.includes('Verified') ? 'text-emerald-400' : 'text-red-400'}`}>{msg}</p>}
      {serverErr && <p className="text-red-400 text-xs m-0">{serverErr}</p>}
    </div>
  );
};

export default EmailVerifyUser;
