// src/components/VolumeChart.jsx
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { getDailyKlines } from "../services/binanceAPI";
import "./volumeChart.css"; // ✅ Import CSS

const VolumeChart = ({ symbol = "BTCUSDT", interval = "1d", type = "bar" }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchVolumeData = async () => {
      try {
        const klines = await getDailyKlines(symbol, interval, 100);
        if (klines && klines.length > 0) {
          setData(klines);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching volume data:", err);
        setData([]);
      }
    };

    fetchVolumeData();
  }, [symbol, interval]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="volume-chart">
        <div className="invalid-type">No volume data available for {symbol}</div>
      </div>
    );
  }

  return (
    <div className="volume-chart">
      <h3 className="volume-title">Volume Chart: {symbol}</h3>
      <div className="volume-chart-container">
        <ResponsiveContainer>
          {type === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  color: "#f3f4f6",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                }}
              />
              <Bar dataKey="volume" fill="#6366F1" />
            </BarChart>
          ) : type === "wave" ? (
            <AreaChart data={data}>
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  color: "#f3f4f6",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#9333EA"
                fill="#7C3AED33"
              />
            </AreaChart>
          ) : type === "candle" ? (
            <ComposedChart data={data}>
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  color: "#f3f4f6",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                }}
              />
              <Bar dataKey="volume" fill="#4F46E5" barSize={6} />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#7C3AED"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          ) : (
            <div className="invalid-type">Invalid chart type</div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
