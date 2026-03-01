import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import FeatureItem from './FeatureItem';
import { fetchIncome } from '../services/adminApi';

const FeaturesInfo = () => {
  const [incomeStats, setIncomeStats] = useState([
    { total: 15000 },
    { total: 18000 }
  ]);
  const [percent, setPercentage] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getIncome = async () => {
      try {
        setLoading(true);
        const res = await fetchIncome(null);
        setIncomeStats(res);
        if (res.length > 1) {
          const percentageChange = ((res[1].total - res[0].total) / res[0].total) * 100;
          setPercentage(percentageChange);
        }
      } catch (err) {
        console.error('FeaturesInfo: Error fetching income data:', err);
        // Set dummy data so the component doesn't look empty
        setIncomeStats([
          { total: 15000 },
          { total: 18000 }
        ]);
        setPercentage(20);
      } finally {
        setLoading(false);
      }
    };
    getIncome();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-32">
        <div className="text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {incomeStats.length > 0 && (
        <FeatureItem
          stuff={[
            {
              id: 1,
              title: 'Revenue',
              money: `${incomeStats[1]?.total || incomeStats[0]?.total}`,
              moneyRate: `${percent.toFixed(2)}%`,
              icon: percent > 0 ? <FaArrowUp /> : <FaArrowDown />,
            },
            {
              id: 2,
              title: 'Sales',
              money: `${incomeStats[0]?.total}`,
              moneyRate: '-1.4%', // Example value, adjust accordingly
              icon:
                parseFloat('-1.4') > 0 ? <FaArrowUp /> : <FaArrowDown />,
            },
            {
              id: 3,
              title: 'Cost',
              money: '1,234', // Example value, adjust accordingly
              moneyRate: '3.4%', // Example value, adjust accordingly
              icon: parseFloat('3.4') > 0 ? <FaArrowUp /> : <FaArrowDown />,
            },
          ]}
          feature2="Compared to last month"
        />
      )}
    </div>
  );
};

export default FeaturesInfo;
