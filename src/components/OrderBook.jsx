// src/components/OrderBook.jsx
import React, { useEffect, useState, useRef } from "react";
import "./OrderBook.css";

const OrderBook = ({ symbol = "BTCUSDT" }) => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const lowerSymbol = symbol.toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${lowerSymbol}@depth10@100ms`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.bids && data.asks) {
        setBids(data.bids.slice(0, 10));
        setAsks(data.asks.slice(0, 10));
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [symbol]);

  const getMaxVolume = () => {
    const allVolumes = [...bids, ...asks].map(order => parseFloat(order[1]));
    return Math.max(...allVolumes, 1); // Avoid divide-by-zero
  };

  const maxVolume = getMaxVolume();

  return (
    <div className="order-book">
      <div className="header">Order Book</div>
      <div className="order-grid">
        <div className="order-col">Bid (Buy)</div>
        <div className="order-col">Volume</div>
        <div className="order-col">Ask (Sell)</div>
      </div>

      {Array.from({ length: 10 }).map((_, i) => {
        const bid = bids[i];
        const ask = asks[i];
        const bidVolume = bid ? parseFloat(bid[1]) : 0;
        const askVolume = ask ? parseFloat(ask[1]) : 0;

        return (
          <div className="order-grid row" key={i}>
            <div className="order-col green">
              {bid ? Number(bid[0]).toFixed(2) : "--"}
            </div>

            <div className="order-col volume-cell">
              <div className="volume-bar-container">
                {bid && (
                  <div
                    className="volume-bar green"
                    style={{ width: `${(bidVolume / maxVolume) * 100}%` }}
                  />
                )}
                {ask && (
                  <div
                    className="volume-bar red"
                    style={{ width: `${(askVolume / maxVolume) * 100}%` }}
                  />
                )}
              </div>
              <span>{bid ? bidVolume.toFixed(2) : "--"}</span>
            </div>

            <div className="order-col red">
              {ask ? Number(ask[0]).toFixed(2) : "--"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderBook;
