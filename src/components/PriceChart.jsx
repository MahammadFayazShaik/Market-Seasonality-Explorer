// src/components/dashboard/PriceChart.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDailyKlines } from "../services/binanceAPI"; // adjust path as needed

import "./PriceChart.css"; // ✅ Import unified styles

const PriceChart = ({ symbol = "BTCUSDT", interval = "1d", totalCandles = 100 }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKlines = async () => {
      setLoading(true);
      try {
        const klines = await getDailyKlines(symbol, interval, totalCandles);
        const transformed = klines.map((item) => {
          const date = new Date(item.time);
          const formattedDate = date.toISOString().slice(0, 10);
          return {
            time: formattedDate,
            price: item.close,
          };
        });
        setChartData(transformed);
      } catch (error) {
        console.error("Failed to fetch price data", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKlines();
  }, [symbol, interval, totalCandles]);

  if (loading) {
    return (
      <div className="chart-box text-gray-400 text-sm text-center p-4">
        Loading price data...
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="chart-box text-red-500 text-center p-4">
        No price data available.
      </div>
    );
  }

  return (
    <div className="chart-box">
      <h3>Price Movement ({symbol})</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#374151",
              color: "#f9fafb",
              fontSize: "14px",
            }}
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
