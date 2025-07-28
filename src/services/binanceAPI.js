// src/services/binance.js
import { fetchWithRetry } from "../utils/request";

const BASE_URL = "https://api.binance.com/api/v3";

export const getDailyKlines = async (
  symbol = "BTCUSDT",
  interval = "1d",
  totalCandles = 500
) => {
  let allData = [];
  let endTime = Date.now();
  const limit = 1000;

  try {
    while (allData.length < totalCandles) {
      const url = `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${endTime}`;
      const data = await fetchWithRetry(url, {}, 3, 300);

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
          time: d[0],
          open,
          high,
          low,
          close,
          volume,
          liquidity,
          volatility,
        };
      });

      allData = [...parsedData, ...allData];
      endTime = data[0][0] - 1;

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Trim to requested candles
    const trimmedData = allData.slice(-totalCandles);

    // Compute Moving Averages
    for (let i = 0; i < trimmedData.length; i++) {
      const closes = trimmedData.slice(Math.max(0, i - 6), i + 1).map(d => d.close);
      trimmedData[i].ma7 = closes.length === 7 ? (closes.reduce((a, b) => a + b, 0) / 7) : null;

      const closes14 = trimmedData.slice(Math.max(0, i - 13), i + 1).map(d => d.close);
      trimmedData[i].ma14 = closes14.length === 14 ? (closes14.reduce((a, b) => a + b, 0) / 14) : null;
    }

    // Benchmark: compare last close to first close
    const firstClose = trimmedData[0]?.close || 1;
    const lastClose = trimmedData[trimmedData.length - 1]?.close || 1;
    const benchmarkChange = ((lastClose - firstClose) / firstClose) * 100;

    trimmedData[trimmedData.length - 1].benchmark = benchmarkChange;

    return trimmedData;
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

  return all.map((d) => ({
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
    const url = `${BASE_URL}/depth?symbol=${symbol}&limit=5`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error("Error fetching order book:", error);
    return null;
  }
};

export const getTickerStats = async (symbol = "BTCUSDT") => {
  try {
    const url = `${BASE_URL}/ticker/24hr?symbol=${symbol}`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error("Error fetching ticker stats:", error);
    return null;
  }
};


// binanceAPI.js
export const getKlinesRange = async (symbol, interval, startTime, endTime) => {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${new Date(startTime).getTime()}&endTime=${new Date(endTime).getTime()}`;
  const response = await fetch(url);
  return await response.json();
};



