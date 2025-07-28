// src/components/dashboard/ComparisonPanel.jsx
import React, { useEffect, useState } from "react";
import { PriceChart } from "./PriceChart"; // Recharts version
import { getKlinesRange } from "../services/binanceAPI"; // you can pass this in as prop if needed

const ComparisonPanel = ({ symbol = "BTCUSDT", rangeA, rangeB, interval = "1d" }) => {
  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!rangeA || !rangeB) return;
      setLoading(true);
      try {
        const [resultA, resultB] = await Promise.all([
          getKlinesRange(symbol, interval, rangeA.start, rangeA.end),
          getKlinesRange(symbol, interval, rangeB.start, rangeB.end),
        ]);
        setDataA(resultA);
        setDataB(resultB);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [symbol, rangeA, rangeB, interval]);

  if (!rangeA || !rangeB) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-[#1f2937] p-4 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold text-white mb-2">
          📅 Range A: {rangeA.start.toDateString()} → {rangeA.end.toDateString()}
        </h3>
        {loading ? (
          <p className="text-gray-400">Loading chart...</p>
        ) : (
          <PriceChart data={dataA} title="Price Chart (Range A)" />
        )}
      </div>

      <div className="bg-[#1f2937] p-4 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold text-white mb-2">
          📅 Range B: {rangeB.start.toDateString()} → {rangeB.end.toDateString()}
        </h3>
        {loading ? (
          <p className="text-gray-400">Loading chart...</p>
        ) : (
          <PriceChart data={dataB} title="Price Chart (Range B)" />
        )}
      </div>
    </div>
  );
};

export default ComparisonPanel;
