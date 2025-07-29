import React, { useEffect, useState, useRef } from "react";
import { BarChart2, Download, Settings } from "lucide-react";
import "./TopNavbar.css";
import { exportCalendarToPDF } from "../utils/exportUtils";

const TopNavbar = ({
  selectedSymbol,
  onSymbolChange,
  viewType,
  onViewChange,
}) => {
  const [allSymbols, setAllSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [symbolDropdownOpen, setSymbolDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("default");

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSymbolDropdownOpen(false);
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol) => {
    onSymbolChange(symbol);
    setSearchTerm("");
    setSymbolDropdownOpen(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="top-panel">
      <div className="panel-left">
        <div className="icon-box">
          <BarChart2 size={20} />
        </div>
        <div className="title-group">
          <h2>Market Seasonality Explorer</h2>
          <p>Visualize volatility, liquidity, and performance</p>
        </div>
      </div>

      <div className="panel-right">
        {/* Symbol Dropdown */}
        <div className="custom-dropdown" ref={dropdownRef}>
          <div
            className="custom-dropdown-toggle"
            onClick={() => setSymbolDropdownOpen((prev) => !prev)}
          >
            {selectedSymbol || "Select Symbol"}
          </div>
          {symbolDropdownOpen && (
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

        {/* View Type Buttons */}
        <div className="view-toggle">
          {["day", "week", "month"].map((view) => (
            <button
              key={view}
              className={`view-btn ${viewType === view ? "active" : ""}`}
              onClick={() => onViewChange(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <span className="live-badge">LIVE</span>

        {/* Export Button */}
        <div className="export-dropdown">
          <button
            className="export-btn"
            onClick={() =>
              exportCalendarToPDF("export-container", "market-dashboard.pdf")
            }
          >
            <Download size={16} style={{ marginRight: "4px" }} />
            Export
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default TopNavbar;
