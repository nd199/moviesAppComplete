import React, {useEffect, useMemo, useState} from "react";
import "./Home.css";
import FeaturesInfo from "../components/FeaturesInfo";
import Chart from "../components/Chart";
import WidgetsSmall from "../components/WidgetsSmall";
import WidgetsLarge from "../components/WidgetsLarge";
import {publicRequest} from "../AxiosMethods";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentAdminDetails } from "../redux/ApiCalls";

const Home = () => {
    const dispatch = useDispatch();
    // const user = useSelector((state) => state?.user);
    // const currentUser = user?.currentUser;
    // // useEffect(() => {
    // //   fetchCurrentAdminDetails(dispatch, currentUser?.email);
    // // }, [dispatch, currentUser.email]);

    const [userStats, setUserStats] = useState([]);

    const MONTHS = useMemo(() => {
        return [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
    }, []);

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await publicRequest.get("/customers/stats");
                const aggregatedData = res.data.reduce((acc, item) => {
                    const month = item.month;
                    if (!acc[month]) {
                        acc[month] = {month, total: 0};
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
        <div className="home">
            <FeaturesInfo/>
            <Chart
                data={userStats}
                title="User Analytics"
                grid
                dataKey="Active User"
            />
            <div className="homeWidgets">
                <WidgetsSmall/>
                <WidgetsLarge/>
            </div>
        </div>
    );
};

export default Home;
