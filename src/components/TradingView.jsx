// src/components/TradingView.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  AreaSeries,
  BarSeries,
  BaselineSeries,
  CandlestickSeries,
} from "lightweight-charts";
import { getDailyKlines } from "../services/binanceAPI";
import "./TradingView.css";

const chartTypes = {
  candlestick: CandlestickSeries,
  area: AreaSeries,
  bar: BarSeries,
  baseline: BaselineSeries,
};

const TradingView = ({ symbol = "BTCUSDT" }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState("1d");
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
          vertLines: { color: "#ccc" },
          horzLines: { color: "#ccc" },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
      });

      chartRef.current = chart;

      const data = await getDailyKlines(symbol, interval);
      const formatted = data.map((d) => ({
        time: d.time / 1000,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        value: d.close, // for Area/Baseline/Bar series
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

      // Set data depending on series type
      if (chartType === "candlestick") {
        series.setData(formatted);
      } else {
        series.setData(formatted.map(({ time, value }) => ({ time, value })));
      }

      seriesRef.current = series;
      chart.timeScale().fitContent();
      setLoading(false);
    };

    initChart();

    return () => {
      if (chartRef.current) chartRef.current.remove();
    };
  }, [symbol, interval, chartType]);

  return (
    <div className="tv-wrapper">
      <div className="tv-controls">
        {["1d", "1w", "1M"].map((int) => (
          <button
            key={int}
            className={interval === int ? "active" : ""}
            onClick={() => setInterval(int)}
          >
            {int.toUpperCase()}
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
