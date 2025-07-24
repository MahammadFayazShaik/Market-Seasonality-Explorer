import React, { useState } from "react";
import Calendar from "../components/Calendar";
import OHLCData from "../components/OHLCData";
import VolumeChart from "../components/VolumeChart";
import PriceChart from "../components/PriceChart";
import Card from "../components/Card";
import TopNavbar from "../components/TopNavbar";
import "./MarketDashboard.css";
import CardsOverview from "../components/CardsOverview";

const MarketDashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [viewType, setViewType] = useState("day"); // "day" | "week" | "month"

  return (
    <div className="pageWrapper">
      {/* Top Navbar */}
      <TopNavbar
        selectedSymbol={selectedSymbol}
        onSymbolChange={setSelectedSymbol}
        viewType={viewType}
        onViewChange={setViewType}
      />

      <div className="dashboardContainer">
        {/* Top Section: Calendar and OHLC + Cards */}
        <div className="topSection">
          <div className="leftPanel">
            <Calendar symbol={selectedSymbol} viewType={viewType} />
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

        {/* Bottom Section: Volume and Price Charts */}
        <div className="dualChartRow">
          <div className="chartCard">
            <VolumeChart symbol={selectedSymbol} viewType={viewType} type="bar" />
          </div>
          <div className="chartCard">
            <PriceChart symbol={selectedSymbol} viewType={viewType} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;
