// src/components/TradingView.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  AreaSeries,
  BarSeries,
  BaselineSeries,
  CandlestickSeries,
} from "lightweight-charts";
import { getDailyKlines } from "../services/binanceAPI"; // assumes this supports intraday
import "./TradingView.css";

const chartTypes = {
  candlestick: CandlestickSeries,
  area: AreaSeries,
  bar: BarSeries,
  baseline: BaselineSeries,
};

const intervalMap = {
  "1D": "1m",   // 1-minute candles for 1 day
  "1W": "5m",   // 5-minute candles for 7 days
  "1M": "1h",   // 1-hour candles for 30 days
  "1Y": "1d",   // 1-day candles
  "5Y": "1d",
  "ALL": "1d",
};

const limitMap = {
  "1D": 1440,       // 24 * 60 minutes
  "1W": 7 * 24 * 12, // 5-minute intervals
  "1M": 720,         // 30 days * 24 hours
  "1Y": 365,
  "5Y": 365 * 5,
  "ALL": 15000,
};

const TradingView = ({ symbol = "BTCUSDT" }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const [loading, setLoading] = useState(true);
  const [intervalLabel, setIntervalLabel] = useState("1D");
  const [chartType, setChartType] = useState("candlestick");

  useEffect(() => {
    const initChart = async () => {
      setLoading(true);

      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (e) {
          console.warn("Chart already removed or disposed.");
        }
        chartRef.current = null;
        seriesRef.current = null;
      }

      const chart = createChart(chartContainerRef.current, {
        layout: {
          textColor: "black",
          background: { type: "solid", color: "white" },
        },
        grid: {
          vertLines: { color: "#eee" },
          horzLines: { color: "#eee" },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        crosshair: {
          mode: 1, // normal crosshair
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: intervalLabel === "1D", // show seconds on 1D
        },
      });

      chartRef.current = chart;

      const interval = intervalMap[intervalLabel] || "1d";
      const limit = limitMap[intervalLabel] || 30;

      try {
        const data = await getDailyKlines(symbol, interval, limit);

        const formatted = data.map((d) => ({
          time: d.time / 1000, // UNIX timestamp in seconds
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          value: d.close,
        }));

        const seriesOptions = {
          candlestick: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
          },
          area: {
            lineColor: "#2962FF",
            topColor: "#2962FF",
            bottomColor: "rgba(41, 98, 255, 0.28)",
          },
          bar: {
            upColor: "#4caf50",
            downColor: "#f44336",
          },
          baseline: {
            baseValue: { type: "price", price: formatted[0]?.close || 0 },
            topLineColor: "#26a69a",
            bottomLineColor: "#ef5350",
            lineWidth: 2,
          },
        };

        const series = chart.addSeries(
          chartTypes[chartType],
          seriesOptions[chartType]
        );

        if (chartType === "candlestick") {
          series.setData(formatted);
        } else {
          series.setData(
            formatted.map(({ time, value }) => ({ time, value }))
          );
        }

        seriesRef.current = series;

        chart.timeScale().fitContent();
      } catch (err) {
        console.error("Failed to load data:", err);
      }

      setLoading(false);
    };

    initChart();

    return () => {
      if (chartRef.current) chartRef.current.remove();
    };
  }, [symbol, intervalLabel, chartType]);

  return (
    <div className="tv-wrapper">
      <div className="tv-controls">
        {Object.keys(intervalMap).map((label) => (
          <button
            key={label}
            className={intervalLabel === label ? "active" : ""}
            onClick={() => setIntervalLabel(label)}
          >
            {label}
          </button>
        ))}
        {Object.keys(chartTypes).map((type) => (
          <button
            key={type}
            className={chartType === type ? "active" : ""}
            onClick={() => setChartType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <div>Loading chart...</div>}
      <div ref={chartContainerRef} className="tv-chart" />
    </div>
  );
};

export default TradingView;
