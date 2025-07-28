// src/components/Calendar.jsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDailyKlines } from "../services/binanceAPI";
import "./Calendar.css";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getMonthMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const matrix = [];
  let week = new Array(7).fill(null);

  for (let i = 0; i < startDay; i++) week[i] = null;
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    week[date.getDay()] = date;
    if (date.getDay() === 6 || day === totalDays) {
      matrix.push(week);
      week = new Array(7).fill(null);
    }
  }
  return matrix;
};

const isTuesday = (date) => date.getDay() === 2;
const isSecondOfMonth = (date) => date.getDate() === 2;

const getWeekRange = (date) => {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return [monday, sunday];
};

const getMonthRange = (date) => [
  new Date(date.getFullYear(), date.getMonth(), 1),
  new Date(date.getFullYear(), date.getMonth() + 1, 0),
];

const aggregateData = (start, end, dataMap) => {
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const formatted = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().split("T")[0];
    if (dataMap[formatted]) dates.push(dataMap[formatted]);
  }
  if (!dates.length) return null;

  const open = dates[0].open;
  const close = dates[dates.length - 1].close;
  const high = Math.max(...dates.map((d) => d.high));
  const low = Math.min(...dates.map((d) => d.low));
  const volume = dates.reduce((sum, d) => sum + d.volume, 0);
  const liquidity = dates.reduce((sum, d) => sum + d.liquidity, 0);
  const changePercent = ((close - open) / open) * 100;
  const volatility = (high - low) / open;

  return { open, close, volume, liquidity, changePercent, volatility };
};

const isSameUTCDate = (date1, date2) => {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
};

const Calendar = ({ symbol = "BTCUSDT", viewType = "day", onDateSelect }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [ohlcData, setOhlcData] = useState({});
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await getDailyKlines(symbol, "1d", 500);
      const parsed = {};
      rawData.forEach((item) => {
        const date = new Date(Date.UTC(
          new Date(item.time).getUTCFullYear(),
          new Date(item.time).getUTCMonth(),
          new Date(item.time).getUTCDate()
        ));
        const formatted = date.toISOString().split("T")[0];
        parsed[formatted] = item;
      });
      setOhlcData(parsed);
    };
    fetchData();
  }, [symbol]);

  const handlePrevMonth = () => (month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1));
  const handleNextMonth = () => (month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1));

  const calendarMatrix = getMonthMatrix(year, month);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrevMonth();
    else if (e.key === "ArrowRight") handleNextMonth();
    else if (e.key === "Enter") {
      setMonth(today.getMonth());
      setYear(today.getFullYear());
    } else if (e.key === "Escape") {
      setRangeStart(null);
      setRangeEnd(null);
    }
  };

  const handleRangeClick = (date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      const start = date < rangeStart ? date : rangeStart;
      const end = date > rangeStart ? date : rangeStart;
      setRangeStart(start);
      setRangeEnd(end);
      onDateSelect?.({ type: "range", start, end });
    }
  };

  return (
    <div className="calendar-container-wrapper">
      <div className="calendar-container" tabIndex={0} onKeyDown={handleKeyDown}>
        <div className="calendar-header">
          <h2 className="calendar-title">
            {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
          </h2>
          <div className="next-buttons">
            <button className="next-prev-buttons" onClick={handlePrevMonth}><ChevronLeft color="white" /></button>
            <button className="next-prev-buttons" onClick={handleNextMonth}><ChevronRight color="white" /></button>
          </div>
        </div>

        <div className="calendar-header-row">
          {daysOfWeek.map((day) => <div key={day}>{day}</div>)}
        </div>

        <div className="calendar-grid">
          {calendarMatrix.flat().map((date, idx) => {
            if (!date) return <div key={idx} className="calendar-day empty"></div>;

            const formatted = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split("T")[0];
            const data = ohlcData[formatted];

            let aggregate = null;
            let displayDate = date.getDate();
            let isHighlighted = false;

            if (viewType === "week" && isTuesday(date)) {
              isHighlighted = true;
              const [start, end] = getWeekRange(date);
              aggregate = aggregateData(start, end, ohlcData);
            } else if (viewType === "month" && isSecondOfMonth(date)) {
              isHighlighted = true;
              const [start, end] = getMonthRange(date);
              aggregate = aggregateData(start, end, ohlcData);
            } else if (viewType === "day") {
              const isPastOrToday = date <= today;
              aggregate = isPastOrToday && data ? {
                open: data.open,
                close: data.close,
                volume: data.volume,
                liquidity: data.liquidity,
                changePercent: ((data.close - data.open) / data.open) * 100,
                volatility: (data.high - data.low) / data.open,
              } : null;
            }

            const isToday = isSameUTCDate(today, date);
            const isInRange = rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd;
            const isBullish = aggregate?.close > aggregate?.open;
            const isBearish = aggregate?.close < aggregate?.open;
            const dotColor = isBullish ? "green" : isBearish ? "red" : "gray";

            let volatilityClass = "";
            if (aggregate?.volatility >= 0.07) volatilityClass = "vol-high";
            else if (aggregate?.volatility >= 0.03) volatilityClass = "vol-medium";
            else if (aggregate?.volatility) volatilityClass = "vol-low";

            const className = [
              "calendar-day",
              volatilityClass,
              isInRange ? "in-range" : "",
              isHighlighted ? "highlighted-date" : "",
              isToday ? "today-highlight" : "",
            ].filter(Boolean).join(" ");

            return (
              <div
                key={idx}
                className={className}
                onClick={() => {
                  if (viewType === "day") handleRangeClick(date);
                  else if (viewType === "week" && isTuesday(date)) onDateSelect?.({ type: "week", start: getWeekRange(date)[0], end: getWeekRange(date)[1] });
                  else if (viewType === "month" && isSecondOfMonth(date)) onDateSelect?.({ type: "month", start: getMonthRange(date)[0], end: getMonthRange(date)[1] });
                }}
              >
                <div className="tooltip-wrapper">
                  <div className="date-number">{displayDate}</div>
                  {aggregate && (
                    <>
                      <div className={`dot ${dotColor}`}></div>
                      <div
                        className="liquidity-line"
                        style={{ height: `${Math.min(12, Math.max(0, 12 - (aggregate.liquidity ?? 0) / 10000))}px` }}
                      ></div>
                      <div className="percent">{(aggregate.changePercent ?? 0).toFixed(0)}%</div>
                      <div className="tooltip">
                        <div><strong>{formatted}</strong></div>
                        <div>Open: {aggregate.open?.toFixed(2)}</div>
                        <div>Close: {aggregate.close?.toFixed(2)}</div>
                        <div>Change: {(aggregate.changePercent ?? 0).toFixed(2)}%</div>
                        <div>Volatility: {((aggregate.volatility ?? 0) * 100).toFixed(2)}%</div>
                        <div>Volume: {aggregate.volume?.toLocaleString()}</div>
                        <div>Liquidity: {aggregate.liquidity?.toLocaleString()}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="legend">
          <span className="legend-item"><div className="dot-green"></div> Low Volatility</span>
          <span className="legend-item"><div className="dot-orange"></div> Medium Volatility</span>
          <span className="legend-item"><div className="dot-red"></div> High Volatility</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
