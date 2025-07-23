import React, { useEffect, useState } from "react";
import { getDailyKlines } from "../services/binanceAPI";
import "./Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const getMonthMatrix = (year, month) => {
  const matrix = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const weeks = [];
  let week = new Array(7).fill(null);

  for (let i = 0; i < startDay; i++) {
    week[i] = null;
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    week[date.getDay()] = date;

    if (date.getDay() === 6 || day === totalDays) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  }

  return weeks;
};

const Calendar = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [ohlcData, setOhlcData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const daysToFetch = 10000;
      const data = await getDailyKlines("BTCUSDT", daysToFetch);
      const parsed = {};
      data.forEach((item) => {
        const date = new Date(item.time);
        const formatted = formatDate(date);
        parsed[formatted] = item;
      });
      setOhlcData(parsed);
    };
    fetchData();
  }, []);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const calendarMatrix = getMonthMatrix(year, month);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h2>
        <div className="next-buttons">
          <button className="next-prev-buttons" onClick={handlePrevMonth}>
            <ChevronLeft color="white" />
          </button>
          <button className="next-prev-buttons" onClick={handleNextMonth}>
            <ChevronRight color="white" />
          </button>
        </div>
      </div>

      <div className="calendar-header-row">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarMatrix.flat().map((date, idx) => {
          if (!date) {
            return <div key={idx} className="calendar-day empty"></div>;
          }

          const formatted = formatDate(date);
          const data = ohlcData[formatted];

          if (!data) {
            return (
              <div key={idx} className="calendar-day">
                <div className="date-number">{date.getDate()}</div>
              </div>
            );
          }

          const isBullish = data.close > data.open;
          const isBearish = data.close < data.open;
          const isHighVol = (data.high - data.low) / data.open > 0.05;
          const changePercent = (((data.close - data.open) / data.open) * 100).toFixed(0);

          const dotColor = isBullish
            ? "green"
            : isBearish
            ? "red"
            : "gray";

   let volatilityClass = "";

if (data?.volatility >= 0.07) {
  volatilityClass = "vol-high";
} else if (data?.volatility >= 0.03) {
  volatilityClass = "vol-medium";
} else {
  volatilityClass = "vol-low";
}


const className = ["calendar-day", volatilityClass].filter(Boolean).join(" ");

            

          return (
            <div key={idx} className={className}>
<div className="date-number" title={`Volatility: ${(data.volatility * 100).toFixed(2)}%`}>
  {date.getDate()}
</div>
              <div className={`dot ${dotColor}`}></div>
{data.liquidity > 0 && (
  <div
    className="liquidity-line"
    style={{
      height: `${Math.min(12, Math.max(0, 12 - data.liquidity / 10000))}px`,
    }}
  ></div>
)}

              <div className="percent">{changePercent}%</div>
              
            </div>
          );
        })}
      </div>

      <div className="legend">
  <span className="legend-item">
    <div className="dot-green"></div> Low Volatility
  </span>
  <span className="legend-item">
    <div className="dot-orange"></div> Medium Volatility
  </span>
  <span className="legend-item">
    <div className="dot-red"></div> High Volatility
  </span>
</div>
</div>

  );
};

export default Calendar;
