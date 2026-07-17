import { Check, Star, Bolt } from '@mui/icons-material';

const PlanCard = ({ plan, isSelected, initiatePlan, deselectPlan, isPopular, savings }) => {
  const { id, name, description, price, interval } = plan;

  return (
    <div
      onClick={() => isSelected ? deselectPlan() : initiatePlan(id)}
      className={`relative p-6 rounded-2xl transition-all duration-500 flex flex-col gap-4 cursor-pointer group
        ${isSelected
          ? 'glass-strong border-brand-500/40 shadow-[0_0_40px_rgba(124,58,237,0.25),0_0_80px_rgba(124,58,237,0.08)] scale-[1.02]'
          : 'glass hover:border-brand-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01]'}`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-[0_4px_15px_rgba(124,58,237,0.4)]">
          <Star sx={{ fontSize: 12 }} /> Most Popular
        </div>
      )}

      {/* Savings badge */}
      {savings && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
          <Bolt sx={{ fontSize: 10 }} /> Save {savings}%
        </div>
      )}

      {/* Glow effect on selected */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 100%)' }} />
      )}

      <div className="relative z-10">
        <h2 className="text-lg font-bold text-white m-0">{name}</h2>
        <p className="text-[#5a6380] text-sm m-0 leading-relaxed mt-1">{description}</p>
      </div>

      <div className="relative z-10 flex items-baseline gap-1 mt-auto">
        <span className="text-3xl font-black text-white">₹{price}</span>
        <span className="text-sm text-[#5a6380]">/ {interval}</span>
      </div>

      {/* Features */}
      {plan.features && (
        <div className="relative z-10 flex flex-col gap-2 pt-3 border-t border-white/5">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[0.75rem] text-[#8892b0]">
              <Check sx={{ fontSize: 14, color: '#22d3ee' }} /> {f}
            </div>
          ))}
        </div>
      )}

      {/* Select indicator */}
      <div className={`relative z-10 mt-2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
        ${isSelected
          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
          : 'bg-white/5 text-white border border-white/10 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 group-hover:text-brand-300'}`}>
        {isSelected ? (
          <>
            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Selected
          </>
        ) : 'Select Plan'}
      </div>
    </div>
  );
};

export default PlanCard;
