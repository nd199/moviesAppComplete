import React from "react";
import "./Chart.css";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis,} from "recharts";

const Chart = ({title, data, dataKey, grid}) => {
    return (
        <div className="chart">
            <h3 className="chart-title">{title}</h3>
            <ResponsiveContainer width="100%" aspect={4 / 1}>
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke="#5550bd"/>
                    <Line type="monotone" dataKey={dataKey} stroke="#5550bd"/>
                    <Tooltip/>
                    {grid && <CartesianGrid stroke="#DE892033" strokeDasharray="10 15"/>}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
