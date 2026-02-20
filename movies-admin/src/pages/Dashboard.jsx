import React, { useEffect, useMemo, useState } from 'react';
import FeaturesInfo from '../components/FeaturesInfo';
import Chart from '../components/Chart';
import WidgetsSmall from '../components/WidgetsSmall';
import WidgetsLarge from '../components/WidgetsLarge';
import { fetchUserStats } from '../services/adminApi';

const Dashboard = () => {
  const [userStats, setUserStats] = useState([]);

  const MONTHS = useMemo(() => {
    return [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
  }, []);

  useEffect(() => {
    const getStats = async () => {
      try {
        const statsData = await fetchUserStats();
        const aggregatedData = statsData.reduce((acc, item) => {
          const month = item.month;
          if (!acc[month]) {
            acc[month] = { month, total: 0 };
          }
          acc[month].total += item.total;
          return acc;
        }, {});
        const formattedData = Object.values(aggregatedData).map((item) => ({
          name: MONTHS[item.month - 1],
          "Active User": item.total,
        }));

        setUserStats(formattedData);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    getStats();
  }, [MONTHS]);

  return (
    <div className="w-full">
      <FeaturesInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid
        dataKey="Active User"
      />
      <div className="flex m-5">
        <WidgetsSmall />
        <WidgetsLarge />
      </div>
    </div>
  );
};

export default Dashboard;
