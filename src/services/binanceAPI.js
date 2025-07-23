export const getDailyKlines = async (
  symbol = "BTCUSDT",
  interval = "1d",
  totalCandles = 2000
) => {
  let allData = [];
  let endTime = Date.now();
  const limit = 1000;

  while (allData.length < totalCandles) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${endTime}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.length) break;

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

    allData = [...parsedData, ...allData]; // prepend to maintain chronological order
    endTime = data[0][0] - 1; // update to 1ms before earliest fetched

    // Pause to avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return allData.slice(-totalCandles); // return only requested number of candles
};


export const getOrderBook = async (symbol = "BTCUSDT") => {
  const res = await fetch(
    `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=5`
  );
  return res.json();
};

export const getTickerStats = async (symbol = "BTCUSDT") => {
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
  );
  return res.json();
};
