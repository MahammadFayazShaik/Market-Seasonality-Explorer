// src/components/dashboard/CardsOverview.jsx
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getDailyKlines, getTickerStats } from "../services/binanceAPI";
import "./CardsOverview.css";

const CardsOverview = ({ symbol = "BTCUSDT" }) => {
  const [stats, setStats] = useState({
    currentPrice: null,
    volume: null,
    rsi: null,
    volatility: null,
    ma10: null,
    ma50: null,
    benchmark: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const klines = await getDailyKlines(symbol, "1d", 50); // Get last 50 days of data
        const ticker = await getTickerStats(symbol);

        if (!klines || klines.length === 0 || !ticker) return;

        const closes = klines.map(k => parseFloat(k.close));
        const price = closes[closes.length - 1];
        const volume = parseFloat(klines[klines.length - 1].volume);

        // Volatility: standard deviation of closing prices
        const avgClose = closes.reduce((a, b) => a + b, 0) / closes.length;
        const variance =
          closes.reduce((acc, val) => acc + Math.pow(val - avgClose, 2), 0) /
          closes.length;
        const volatility = Math.sqrt(variance);

        // RSI Calculation (14-day)
        const calculateRSI = (values) => {
          let gains = 0;
          let losses = 0;
          for (let i = 1; i < values.length; i++) {
            const diff = values[i] - values[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
          }
          const avgGain = gains / (values.length - 1);
          const avgLoss = losses / (values.length - 1);
          const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
          return 100 - 100 / (1 + rs);
        };

        const rsi = calculateRSI(closes.slice(-14));

        const ma10 = closes.slice(-10).reduce((a, b) => a + b, 0) / 10;
        const ma50 = closes.reduce((a, b) => a + b, 0) / 50;

        const benchmark =
          price > ma50
            ? "Price is above MA50 (bullish)"
            : "Price is below MA50 (bearish)";

        setStats({
          currentPrice: `$${price.toFixed(2)}`,
          volume: volume.toLocaleString(),
          rsi: rsi.toFixed(2),
          volatility: volatility.toFixed(4),
          ma10: `$${ma10.toFixed(2)}`,
          ma50: `$${ma50.toFixed(2)}`,
          benchmark,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [symbol]);

  return (
    <div className="stats-container">
      <Card label="Current Price" value={stats.currentPrice || "..."} />
      <Card label="24h Volume" value={stats.volume || "..."} />
      <Card label="RSI (14D)" value={stats.rsi || "..."} />
      <Card label="Volatility" value={stats.volatility || "..."} />
      <Card label="10-Day MA" value={stats.ma10 || "..."} />
      <Card label="50-Day MA" value={stats.ma50 || "..."} />
      <Card label="Benchmark" value={stats.benchmark || "..."} />
    </div>
  );
};

export default CardsOverview;
