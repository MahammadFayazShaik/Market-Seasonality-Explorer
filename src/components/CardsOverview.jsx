// src/components/dashboard/CardsOverview.jsx
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getDailyKlines, getTickerStats } from "../services/binanceAPI";
import './CardsOverview.css';   

const CardsOverview = ({ symbol = "BTCUSDT" }) => {
  const [stats, setStats] = useState({
    currentPrice: null,
    volume: null,
    rsi: null,
    volatility: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const klines = await getDailyKlines(symbol, "1d", 15); // 15 candles for RSI
        const ticker = await getTickerStats(symbol);

        if (!klines.length || !ticker) return;

        const closes = klines.map(k => k.close);
        const price = closes[closes.length - 1];
        const volume = klines[klines.length - 1].volume;
        const volatility = klines[klines.length - 1].volatility;

        const calculateRSI = (closes) => {
          let gains = 0;
          let losses = 0;
          for (let i = 1; i < closes.length; i++) {
            const diff = closes[i] - closes[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
          }
          const avgGain = gains / (closes.length - 1);
          const avgLoss = losses / (closes.length - 1);
          const rs = avgGain / avgLoss;
          return 100 - 100 / (1 + rs);
        };

        const rsi = calculateRSI(closes);

        setStats({
          currentPrice: `$${parseFloat(price).toFixed(2)}`,
          volume: parseFloat(volume).toLocaleString(),
          rsi: rsi.toFixed(2),
          volatility: volatility.toFixed(4),
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
    </div>
  );
};

export default CardsOverview;
