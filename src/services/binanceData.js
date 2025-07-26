// binanceData.js
import { getDailyKlines } from "./binanceAPI"; // your Binance REST API caller

const resolutionsMap = {
  "1D": "1d",
  "1W": "1w",
  "1M": "1M",
  "1yr" : "1y",
};

const binanceData = {
  onReady: (callback) => setTimeout(() => callback({
    supports_search: false,
    supports_group_request: false,
    supported_resolutions: Object.keys(resolutionsMap),
    exchanges: [{ value: "Binance", name: "Binance", desc: "Binance Crypto Exchange" }],
    symbols_types: [{ name: "Cryptocurrency", value: "crypto" }]
  }), 0),

  resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
    const symbolInfo = {
      name: symbolName,
      ticker: symbolName,
      description: symbolName,
      type: "crypto",
      session: "24x7",
      timezone: "Etc/UTC",
      pricescale: 100,
      minmov: 1,
      has_intraday: false,
      has_no_volume: false,
      supported_resolutions: Object.keys(resolutionsMap),
      volume_precision: 2
    };
    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  },

  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) => {
    try {
      const interval = resolutionsMap[resolution] || "1d";
      let bars = await getDailyKlines(symbolInfo.name, interval, 500);
      bars = bars.filter(bar => (bar.time / 1000) >= from && (bar.time / 1000) <= to);
      const formattedBars = bars.map(bar => ({
        time: bar.time / 1000, // seconds
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume
      }));
      if (formattedBars.length) onHistoryCallback(formattedBars, { noData: false });
      else onHistoryCallback([], { noData: true });
    } catch (error) {
      onErrorCallback(error);
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID) => {
    // Implement real-time bars updates.
    // For example, use Binance WebSocket streams to push new bars.
    // This requires a separate polling or WebSocket process to send data here.
  },

  unsubscribeBars: (subscriberUID) => {
    // Cleanup real-time subscriptions here.
  }
};

export default binanceData;
