import { useState } from 'react';
import PlanCard from '../../Components/PlanCard';
import Footer from '../../Components/Footer';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPaymentPlan } from '../../redux/PaymentRedux';

const plans = [
  { id: 1, name: 'Monthly', price: 300, interval: 'month', description: 'Access all content for a month.' },
  { id: 3, name: '6-Month', price: 50, interval: '6 months', description: 'Best value for 6 months.' },
  { id: 12, name: 'Yearly', price: 1200, interval: 'year', description: 'Save 20% with annual billing.' },
];

const Subscription = () => {
  const [selected, setSelected] = useState(null);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const subscribe = () => {
    if (!selected) return;
    const plan = plans.find(p => p.id === selected);
    dispatch(setPaymentPlan({ selectedPlan: plan, allPlans: plans }));
    nav("/email-verification", { state: { plan } });
  };

  return (
    <>
      <div className="min-h-screen bg-surface-950 pt-24 pb-12">
        <div className="max-w-[800px] mx-auto px-5">
          <h2 className="text-2xl font-bold text-white text-center mb-8 m-0">Choose a Plan</h2>
          <div className={`grid gap-4 mb-8 ${selected ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {selected
              ? <PlanCard key={selected} plan={plans.find(p => p.id === selected)} isSelected initiatePlan={id => setSelected(id)} deselectPlan={() => setSelected(null)} />
              : plans.map(p => <PlanCard key={p.id} plan={p} isSelected={false} initiatePlan={id => setSelected(id)} />)}
          </div>
          <button onClick={subscribe} disabled={!selected} className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed">
            Subscribe
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Subscription;
