import React, { useEffect, useState } from "react";
import { getDailyKlines } from "../services/binanceAPI";
import "./OHLC.css";

const OHLCData = ({ symbol, interval = "1d" }) => {
  const [ohlc, setOhlc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOHLC = async () => {
      if (!symbol) return;

      setLoading(true);
      try {
        const data = await getDailyKlines(symbol, interval, 500);
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          setOhlc(latest);
        }
      } catch (error) {
        console.error("Error fetching OHLC data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOHLC();
  }, [symbol, interval]);

  // 👇 This prevents crash without early return
  const { open, high, low, close } = ohlc || {};

  return (
    <div className="ohlc-section">
      <h3 className="ohlc-title">OHLC Data ({symbol})</h3>
      <div className="ohlc-grid">
        <div>
          <div>Open</div>
          <div className="ohlc-value">
            {open ? `$${open.toLocaleString()}` : "--"}
          </div>
        </div>
        <div>
          <div>High</div>
          <div className="ohlc-value text-green">
            {high ? `$${high.toLocaleString()}` : "--"}
          </div>
        </div>
        <div>
          <div>Low</div>
          <div className="ohlc-value text-red">
            {low ? `$${low.toLocaleString()}` : "--"}
          </div>
        </div>
        <div>
          <div>Close</div>
          <div className="ohlc-value text-blue">
            {close ? `$${close.toLocaleString()}` : "--"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OHLCData;
