// utils/binance.js or api.js

import { all } from "axios";

const BASE_URL = "https://api.binance.com/api/v3";

export const getDailyKlines = async (
  symbol = "BTCUSDT",
  interval = "1d",
  totalCandles = 2000
) => {
  let allData = [];
  let endTime = Date.now();
  const limit = 1000;

  try {
    while (allData.length < totalCandles) {
      const url = `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${endTime}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data) || !data.length) break;

      const parsedData = data.map((d) => {
        const open = parseFloat(d[1]);
        const high = parseFloat(d[2]);
        const low = parseFloat(d[3]);
        const close = parseFloat(d[4]);
        const volume = parseFloat(d[5]);
        const range = high - low;
        const liquidity = range > 0 ? volume / range : 0;
        const volatility = open > 0 ? range / open : 0;

        return {
          symbol,
          time: d[0], // timestamp in ms
          open,
          high,
          low,
          close,
          volume,
          liquidity,
          volatility,
        };
      });

      allData = [...parsedData, ...allData]; // prepend to keep chronological order
      endTime = data[0][0] - 1;

      // Pause to avoid hitting rate limits (Binance allows ~10-20 reqs/sec per IP)
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return allData.slice(-totalCandles); // only latest N candles
  } catch (error) {
    console.error("Error fetching daily klines:", error);
    return [];
  }
};



export const getPriceAndVolumeData = async (
  symbol = "BTCUSDT",
  interval = "1d",
  totalCandles = 200
) => {
  const all = await getDailyKlines(symbol, interval, totalCandles);

  return all.map(d => ({
    time: d.time,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
  }));
};




export const getOrderBook = async (symbol = "BTCUSDT") => {
  try {
    const res = await fetch(`${BASE_URL}/depth?symbol=${symbol}&limit=5`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching order book:", error);
    return null;
  }
};

export const getTickerStats = async (symbol = "BTCUSDT") => {
  try {
    const res = await fetch(`${BASE_URL}/ticker/24hr?symbol=${symbol}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching ticker stats:", error);
    return null;
  }
};
