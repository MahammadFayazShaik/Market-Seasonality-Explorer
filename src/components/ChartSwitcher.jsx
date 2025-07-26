// src/components/ChartSwitcher.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
  Area,
} from "recharts";
import { getDailyKlines } from "../services/binanceAPI"; // Update path as needed

const ChartSwitcher = ({ symbol = "BTCUSDT", interval = "1d" }) => {
  const [chartType, setChartType] = useState("candles");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchKlines = async () => {
      const response = await getDailyKlines(symbol, interval);
      const transformed = response.map(d => ({
        time: new Date(d[0]).toLocaleDateString(),
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
      }));
      setData(transformed);
    };
    fetchKlines();
  }, [symbol, interval]);

  return (
    <div style={{ background: "#1e1e1e", padding: "1rem", borderRadius: "10px", color: "white" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label>Chart Type: </label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{ padding: "0.3rem", borderRadius: "5px" }}
        >
          <option value="candles">Candlestick</option>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <XAxis dataKey="time" stroke="#ccc" />
          <YAxis domain={["dataMin", "dataMax"]} stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
          <CartesianGrid stroke="#333" />

          {chartType === "candles" &&
            data.map((d, idx) => (
              <Bar
                key={idx}
                dataKey="close"
                fill={d.close >= d.open ? "#00ff95" : "#ff4e4e"}
                barSize={4}
              />
            ))}

          {chartType === "bar" && <Bar dataKey="close" fill="#2f81f7" barSize={6} />}
          {chartType === "line" && <Line dataKey="close" stroke="#00ff95" strokeWidth={2} />}
          {chartType === "area" && (
            <Area
              dataKey="close"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSwitcher;
