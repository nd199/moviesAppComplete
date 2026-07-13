import { Send } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';
import { validateSubscriptionOtp, verifySubscriptionEmail } from '../Network/ApiCalls';
import { resetErrorMessage } from '../redux/userSlice';
import CrossMark from '../Utils/animations/CrossMark.json';
import TickMark from '../Utils/animations/TickMark.json';

const inputClass = "flex-1 glass rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#4a5568] focus:outline-none focus:border-brand-500/40 transition-all disabled:opacity-50";

const EmailSubscriptionVerify = ({ onEmailUpdate, onEmailVerified, onEmailError }) => {
  const [email, setEmail] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [mailOtp, setMailOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [msg, setMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const currEmail = useSelector(s => s?.user?.currentUser?.email);

  useEffect(() => () => { dispatch(resetErrorMessage()); setMsg(''); setError(''); setShowOtp(''); }, [dispatch]);
  useEffect(() => { onEmailUpdate(email); }, [email, onEmailUpdate]);
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validOtp = (o) => /^\d{6}$/.test(o);
  const tick = { loop: true, autoplay: true, animationData: TickMark, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };
  const cross = { loop: true, autoplay: true, animationData: CrossMark, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } };

  const sendOtp = async () => {
    try { setShowVerify(false); setShowOtp(true); const r = await verifySubscriptionEmail(dispatch, email); setMsg(r); setTimer(60); }
    catch (err) { console.error(err); }
  };

  const verifyOtp = async () => {
    if (timer <= 0 && mailOtp) { setError('OTP expired. Re-enter email.'); setShowVerify(true); setShowOtp(false); setMailOtp(''); setEmail(''); return; }
    setVerifying(true);
    try {
      const r = await validateSubscriptionOtp(dispatch, mailOtp, email); setMsg(r); setShowOtp(false); setError('');
      if (r === 'OTP verified successfully') { setDisabled(true); onEmailVerified(true); }
    } catch (err) {
      setShowOtp(false); setMsg(err?.response?.data); setError(err?.response?.data + ' Re-enter email.'); setMailOtp(''); setEmail(''); onEmailVerified(false);
    } finally { setVerifying(false); }
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-[#8892b0]">EMAIL</label>
        <div className="flex items-center gap-2">
          <input type="email" placeholder="your@email.com" value={email} disabled={disabled}
            onChange={e => {
              const v = e.target.value.toLowerCase(); setEmail(v);
              if (validEmail(v)) {
                if (v === currEmail) { setShowVerify(true); onEmailError(''); }
                else { onEmailError('Email mismatch'); setShowVerify(false); }
              }
              else { setShowVerify(false); onEmailError(''); }
              setMsg('');
            }}
            className={inputClass} />
          {msg === 'OTP verified successfully' && <Lottie options={tick} style={{ width: 32, height: 32 }} />}
          {msg === 'Invalid OTP or OTP expired' && <Lottie options={cross} style={{ width: 32, height: 32 }} />}
        </div>
        {showVerify && <button type="button" onClick={sendOtp} disabled={!validEmail(email)} className="btn-primary text-sm !py-2.5">Verify Email</button>}
        {showOtp && (
          <div className="flex flex-col gap-2">
            {verifying ? <p className="text-[#5a6380] text-sm m-0">Verifying...</p> : (
              <div className="flex items-center gap-2">
                <input type="text" placeholder="OTP" value={mailOtp} onChange={e => setMailOtp(e.target.value)} className={inputClass} />
                <button disabled={!validOtp(mailOtp)} onClick={verifyOtp} className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center !p-0 disabled:opacity-50"><Send sx={{ fontSize: 16 }} /></button>
                <span className="text-[#5a6380] text-xs">Expires <span className="text-brand-300 font-medium">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span></span>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-white text-sm mt-2 m-0">{error}</p>}
    </form>
  );
};

export default EmailSubscriptionVerify;
