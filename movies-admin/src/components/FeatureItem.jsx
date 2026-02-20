import React from 'react';
import Typewriter from 'typewriter-effect';

const FeatureItem = ({ stuff, feature2 }) => {
  return (
    <div className="w-full flex justify-between">
      {stuff?.map(item => (
        <div 
          className="flex-1 mx-5 p-8 rounded-lg cursor-pointer shadow-lg"
          style={{
            boxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
            WebkitBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)',
            MozBoxShadow: '2px 4px 58px 4px rgba(222, 137, 37, 0.29)'
          }}
          key={item.id}
        >
          <span className="text-xl"></span>
          <div className="my-2.5 mx-0 flex flex-col">
            <span className="text-xl">{item.title}</span>
            <div className="flex items-center gap-5">
              <span className="text-4xl font-medium">
                <Typewriter
                  options={{
                    strings: [`₹ ${item.money}`],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
              <span className="flex self-center ml-5 text-xl">
                {item.moneyRate}{' '}
                <span
                  className={`text-base ml-1 ${
                    item.moneyRate < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {item.icon}
                </span>
              </span>
            </div>
          </div>
          <span className="text-base text-gray-800">{feature2}</span>
        </div>
      ))}
    </div>
  );
};

export default FeatureItem;
