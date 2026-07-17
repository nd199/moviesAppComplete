import { useState } from 'react';
import PlanCard from '../../Components/PlanCard';
import Footer from '../../Components/Footer';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPaymentPlan } from '../../redux/PaymentRedux';
import { useScrollReveal } from '../../Utils/useScrollReveal';
import { CheckCircle, Email, Payment } from '@mui/icons-material';

const plans = [
  {
    id: 1, name: 'Monthly', price: 300, interval: 'month',
    description: 'Flexible month-to-month access.',
    features: ['HD Streaming', 'Watch on 1 device', 'Full content library', 'Cancel anytime'],
  },
  {
    id: 3, name: '6-Month', price: 50, interval: 'month',
    description: 'Best value for committed viewers.',
    features: ['Full HD Streaming', 'Watch on 2 devices', 'Full content library', 'Download for offline', 'Priority support'],
    isPopular: true,
  },
  {
    id: 12, name: 'Yearly', price: 1200, interval: 'year',
    description: 'Maximum savings with annual billing.',
    features: ['4K Ultra HD Streaming', 'Watch on 4 devices', 'Full content library', 'Download for offline', 'Priority support', 'Early access to originals'],
    savings: 20,
  },
];

const steps = [
  { label: 'Choose Plan', icon: CheckCircle },
  { label: 'Verify Email', icon: Email },
  { label: 'Payment', icon: Payment },
];

const Subscription = () => {
  const [selected, setSelected] = useState(null);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const heroRef = useScrollReveal({ threshold: 0.1 });

  const selectedPlan = plans.find(p => p.id === selected);

  const subscribe = () => {
    if (!selected) return;
    const plan = selectedPlan;
    dispatch(setPaymentPlan({ selectedPlan: plan, allPlans: plans }));
    nav("/email-verification", { state: { plan } });
  };

  return (
    <>
      <div className="min-h-screen bg-surface-950">
        {/* Hero header */}
        <div className="relative pt-24 pb-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/8 blur-[120px] pointer-events-none" />
          <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] bg-accent-500/5 blur-[100px] pointer-events-none" />

          <div ref={heroRef} className="reveal max-w-[900px] mx-auto relative z-10">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === 0;
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.7rem] font-medium transition-all duration-300
                      ${isActive ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-white/5 text-[#4a5568] border border-white/5'}`}>
                      <Icon sx={{ fontSize: 14 }} />
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-8 h-px ${i === 0 ? 'bg-brand-500/40' : 'bg-white/10'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-gradient text-xs font-bold uppercase tracking-[0.2em] mb-3 text-center m-0">Subscription</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white m-0 mb-3 text-center tracking-tight leading-tight">
              Choose Your Plan
            </h1>
            <p className="text-[#8892b0] text-sm max-w-[450px] mx-auto text-center m-0 mb-2">
              Unlock unlimited streaming with the plan that fits you best.
            </p>
            <div className="h-[3px] w-16 mx-auto rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          </div>
        </div>

        {/* Plans grid */}
        <div className="max-w-[1000px] mx-auto px-5 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selected === plan.id}
                initiatePlan={id => setSelected(id)}
                deselectPlan={() => setSelected(null)}
                isPopular={plan.isPopular}
                savings={plan.savings}
              />
            ))}
          </div>

          {/* Selected plan summary */}
          {selectedPlan && (
            <div className="mt-8 glass-strong rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                    <CheckCircle className="text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm m-0">{selectedPlan.name} Plan</h3>
                    <p className="text-[#5a6380] text-xs m-0">Billed {selectedPlan.interval} · ₹{selectedPlan.price}/{selectedPlan.interval}</p>
                  </div>
                </div>
                <button onClick={subscribe} className="btn-primary !px-8 !py-3 rounded-xl text-sm">
                  Continue to Verification
                </button>
              </div>
            </div>
          )}

          {/* Continue button (when no plan selected yet on mobile) */}
          {!selectedPlan && (
            <button onClick={subscribe} disabled={!selected} className="mt-8 w-full btn-primary text-center disabled:opacity-40 disabled:cursor-not-allowed !py-3.5 rounded-xl">
              Select a Plan to Continue
            </button>
          )}
        </div>

        {/* Trust signals */}
        <div className="max-w-[800px] mx-auto px-5 pb-16">
          <div className="flex items-center justify-center gap-6 flex-wrap text-[0.7rem] text-[#4a5568]">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Cancel Anytime
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Subscription;
