// src/components/RangeCompareCalendar.jsx
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "./DateRangePicker";
import { ComparisonChart } from "./ComparisonChart";
import ComparisonStats from "./ComparisonStats"; // ✅ import this
import { getKlinesRange } from "../services/binanceAPI";
import "./RangeCompareCalendar.css";
import OrderBook from "./OrderBook";

const RangeCompareCalendar = ({ symbol = "BTCUSDT", interval = "1d"  }) => {
  const [rangeA, setRangeA] = useState({ from: null, to: null });
  const [rangeB, setRangeB] = useState({ from: null, to: null });
  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);

  useEffect(() => {
    if (rangeA.from && rangeA.to) {
      const start = new Date(rangeA.from).getTime();
      const end = new Date(rangeA.to).getTime();
      getKlinesRange(symbol, interval, start, end)
        .then(setDataA)
        .catch(console.error);
    }
  }, [rangeA, symbol, interval]);

  useEffect(() => {
    if (rangeB.from && rangeB.to) {
      const start = new Date(rangeB.from).getTime();
      const end = new Date(rangeB.to).getTime();
      getKlinesRange(symbol, interval, start, end)
        .then(setDataB)
        .catch(console.error);
    }
  }, [rangeB, symbol, interval]);

  return (
    <div >
    <div className="range-comparison-panel">
      <div className="comparison-column-container">
        <div className="comparison-column">
          <DateRangePicker label="Period A" onChange={setRangeA} />
          <ComparisonChart title="Period A" data={dataA} />
        </div>
        <div className="comparison-column">
          <DateRangePicker label="Period B" onChange={setRangeB} />
          <ComparisonChart title="Period B" data={dataB} />
        </div>
      </div>

      {/* ✅ Render ComparisonStats below the charts */}
      
    </div>
     <div className="dualChartRow">
              <div className="chartCard2">
                <OrderBook symbol={symbol} />
              </div>
              <div className="chartCard">
                    <ComparisonStats dataForRangeA = {dataA} dataForRangeB={dataB}/>

              </div>

              
            </div>
    </div>
  );
};

export default RangeCompareCalendar;
