import React from 'react';
import Typewriter from 'typewriter-effect';

const FeatureItem = ({ stuff, feature2 }) => {
  return (
    <div className="w-full flex justify-between">
      {stuff?.map(item => (
        <div
          className="flex-1 mx-5 p-8 rounded-lg cursor-pointer shadow-lg bg-white/5 dark:bg-slate-800/50 border border-white/10 dark:border-slate-700/50 hover:bg-white/10 dark:hover:bg-slate-700/30 transition-colors"
          key={item.id}
        >
          <span className="text-xl text-slate-100 dark:text-white"></span>
          <div className="my-2.5 mx-0 flex flex-col">
            <span className="text-xl text-slate-100 dark:text-white font-medium">{item.title}</span>
            <div className="flex items-center gap-5">
              <span className="text-4xl font-medium text-slate-100 dark:text-white">
                <Typewriter
                  options={{
                    strings: [`₹ ${item.money}`],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
              <span className="flex self-center ml-5 text-xl text-slate-300 dark:text-slate-400">
                {item.moneyRate}{' '}
                <span
                  className={`text-base ml-1 ${
                    item.moneyRate < 0 ? 'text-red-400 dark:text-red-300' : 'text-green-400 dark:text-green-300'
                  }`}
                >
                  {item.icon}
                </span>
              </span>
            </div>
          </div>
          <span className="text-base text-slate-400 dark:text-slate-300">{feature2}</span>
        </div>
      ))}
    </div>
  );
};

export default FeatureItem;
