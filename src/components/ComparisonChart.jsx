// ComparisonChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import "./ComparisonChart.css";

export const ComparisonChart = ({ title, data }) => {
  const formattedData = data.map((d) => ({
    time: format(new Date(d[0]), "MMM d"),
    close: parseFloat(d[4]),
  }));

  return (
    <div className="comparison-chart">
      <h4 className="comparison-title">{title}</h4>
      <div className="comparison-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
