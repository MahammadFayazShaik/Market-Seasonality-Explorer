import React, { useEffect, useState, useRef } from "react";
import { BarChart2, Download, Settings } from "lucide-react";
import "./TopNavbar.css";

const TopNavbar = ({ selectedSymbol, onSymbolChange }) => {
  const [allSymbols, setAllSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const data = await res.json();
        const usdtPairs = data.symbols
          .filter((s) => s.symbol.endsWith("USDT"))
          .map((s) => s.symbol);
        setAllSymbols(usdtPairs);
        setFilteredSymbols(usdtPairs);
      } catch (err) {
        console.error("Failed to fetch symbols:", err);
      }
    };

    fetchSymbols();
  }, []);

  useEffect(() => {
    const filtered = allSymbols.filter((sym) =>
      sym.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSymbols(filtered);
  }, [searchTerm, allSymbols]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol) => {
    onSymbolChange(symbol);
    setSearchTerm("");
    setDropdownOpen(false);
  };

  return (
    <div className="top-panel">
      {/* Left Section */}
      <div className="panel-left">
        <div className="icon-box">
          <BarChart2 size={20} />
        </div>
        <div className="title-group">
          <h2>Market Seasonality Explorer</h2>
          <p>Visualize volatility, liquidity, and performance</p>
        </div>
      </div>

      {/* Center + Right Section */}
      <div className="panel-right">
        <div className="custom-dropdown" ref={dropdownRef}>
          <div
            className="custom-dropdown-toggle"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {selectedSymbol || "Select Symbol"}
          </div>
          {dropdownOpen && (
            <div className="custom-dropdown-menu">
              <input
                type="text"
                placeholder="Search..."
                className="custom-dropdown-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="custom-dropdown-list">
                {filteredSymbols.map((symbol) => (
                  <li
                    key={symbol}
                    className="custom-dropdown-item"
                    onClick={() => handleSelect(symbol)}
                  >
                    {symbol}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="view-toggle">
          <button className="view-btn active">Day</button>
          <button className="view-btn">Week</button>
          <button className="view-btn">Month</button>
        </div>

        <span className="live-badge">LIVE</span>

        <button className="export-btn">
          <Download size={16} style={{ marginRight: "4px" }} />
          Export
        </button>
        <button className="settings-btn">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
