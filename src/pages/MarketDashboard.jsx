import React, { useState } from "react";
import Calendar from "../components/Calendar";
import OHLCData from "../components/OHLCData";
import VolumeChart from "../components/VolumeChart";
import PriceChart from "../components/PriceChart";
import TopNavbar from "../components/TopNavbar";
import CardsOverview from "../components/CardsOverview";
import OrderBook from "../components/OrderBook";
import TradingView from "../components/TradingView";
import RangeCompareCalendar from "../components/RangeCompareCalendar";
import Footer from "../components/Footer";
import ComparisonStats from "../components/ComparisonStats";
import "./MarketDashboard.css";
import { exportCalendarToPDF } from "../utils/exportUtils";
import { getKlinesRange } from "../services/binanceAPI";

// Utility to fetch and format klines for a date range
const fetchKlinesForRange = async (symbol, range) => {
  if (!range?.from || !range?.to) return [];

  try {
    const raw = await getKlinesRange(symbol, "1d", range.from, range.to);
    if (!Array.isArray(raw)) return [];

    return raw.map((d) => ({
      time: d[0],
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));
  } catch (err) {
    console.error("Failed to fetch range klines:", err);
    return [];
  }
};

const MarketDashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [viewType, setViewType] = useState("day"); // "day" | "week" | "month"
   const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);


  const handleDataChange = (type, data) => {
    if (type === "A") setDataA(data);
    else if (type === "B") setDataB(data);
  };

  const handleRangeCompare = async (ranges) => {
    const [dataA, dataB] = await Promise.all([
      fetchKlinesForRange(selectedSymbol, ranges.rangeA),
      fetchKlinesForRange(selectedSymbol, ranges.rangeB),
    ]);
    setDataForRangeA(dataA);
    setDataForRangeB(dataB);
  };
  return (
    <div className="pageWrapper">
      <TopNavbar
        selectedSymbol={selectedSymbol}
        onSymbolChange={setSelectedSymbol}
        viewType={viewType}
        onViewChange={setViewType}
        onExport={() => exportCalendarToPDF("export-container", "market_dashboard")}
      />

      <div id="export-container">
        <div className="dashboardContainer">
          <div id="pdf-page-1">
            {/* Calendar + OHLC + Cards */}
            <div className="topSection">
              <div className="leftPanel">
                <Calendar
                  symbol={selectedSymbol}
                  viewType={viewType}
                  onRangeCompare={handleRangeCompare}
                />
              </div>

              <div className="rightPanel">
                <div className="chartCard">
                  <OHLCData symbol={selectedSymbol} viewType={viewType} />
                </div>
                <div className="chartCard">
                  <CardsOverview symbol={selectedSymbol} viewType={viewType} />
                </div>
              </div>
            </div>

            {/* TradingView */}
            <div className="chart-Card vertical-Stack">
              <TradingView symbol={selectedSymbol} viewType={viewType} />
            </div>

            {/* Range Comparison Calendar */}
            <div className="chart-Card vertical-Stack">
              <RangeCompareCalendar
                symbol={selectedSymbol}
                interval="1d"
                onRangeCompare={handleRangeCompare}
                

                
              />
            </div>

            {/* OrderBook + Stats Comparison */}
           
          </div>

          {/* Volume and Price Charts */}
          <div id="pdf-page-2">
              <div className="chart-Card vertical-Stack">
                <VolumeChart
                  symbol={selectedSymbol}
                  viewType={viewType}
                  type="bar"
                />
              </div>
              <div className="chart-Card vertical-Stack">
                <PriceChart symbol={selectedSymbol} viewType={viewType} />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
