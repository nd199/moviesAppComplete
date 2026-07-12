import Typewriter from 'typewriter-effect';

const FeatureItem = ({ stuff, feature2 }) => (
  <div className="flex flex-col gap-3">
    {stuff?.map(item => (
      <div key={item.id} className="glass rounded-xl p-4 flex flex-col gap-2 hover:border-brand-500/20 transition-all">
        <span className="text-white font-semibold text-sm">{item.title}</span>
        <div className="flex items-center justify-between">
          <span className="text-brand-400 font-bold">
            <Typewriter options={{ strings: [`₹ ${item.money}`], autoStart: true, loop: true }} />
          </span>
          <span className={`text-xs font-medium ${item.moneyRate < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {item.moneyRate} {item.icon}
          </span>
        </div>
        {feature2 && <span className="text-[#5a6380] text-xs">{feature2}</span>}
      </div>
    ))}
  </div>
);

export default FeatureItem;
