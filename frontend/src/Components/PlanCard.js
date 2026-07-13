const PlanCard = ({ plan, isSelected, initiatePlan, deselectPlan }) => {
  const { id, name, description, price, interval } = plan;
  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4
      ${isSelected
        ? 'glass-strong border-brand-500/40 glow-brand'
        : 'glass hover:border-brand-500/20'}`}>
      <h2 className="text-lg font-bold text-white m-0">{name}</h2>
      <p className="text-[#5a6380] text-sm m-0 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-2xl font-extrabold text-white">₹{price}<span className="text-sm font-normal text-[#5a6380] ml-1">/ {interval}</span></span>
        <button onClick={() => isSelected ? deselectPlan() : initiatePlan(id)}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border-none cursor-pointer
            ${isSelected
              ? 'bg-white/10 text-white hover:bg-white/15'
              : 'btn-primary !px-5 !py-2'}`}>
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
