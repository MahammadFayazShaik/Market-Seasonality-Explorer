// src/components/ComparisonStats.jsx
import React from "react";
import "./ComparisonStats.css";

const calculateStats = (data) => {
  if (!data || data.length === 0) return null;

  const closingPrices = data.map(d => parseFloat(d[4]));
  const volumes = data.map(d => parseFloat(d[5]));
  const highPrices = data.map(d => parseFloat(d[2]));
  const lowPrices = data.map(d => parseFloat(d[3]));

  const averageClose =
    closingPrices.reduce((a, b) => a + b, 0) / closingPrices.length;
  const totalVolume = volumes.reduce((a, b) => a + b, 0);
  const avgVolume = totalVolume / volumes.length;

  const maxHigh = Math.max(...highPrices);
  const minLow = Math.min(...lowPrices);

  const priceChangePercent =
    ((closingPrices[closingPrices.length - 1] - closingPrices[0]) /
      closingPrices[0]) *
    100;

  const volatilityPercent = ((maxHigh - minLow) / minLow) * 100;

  return {
    averageClose: averageClose.toFixed(2),
    totalVolume: totalVolume.toFixed(2),
    avgVolume: avgVolume.toFixed(2),
    maxHigh: maxHigh.toFixed(2),
    minLow: minLow.toFixed(2),
    priceChangePercent: priceChangePercent.toFixed(2),
    volatilityPercent: volatilityPercent.toFixed(2),
  };
};

const ComparisonStats = ({ dataForRangeA, dataForRangeB }) => {
  const statsA = calculateStats(dataForRangeA);
  const statsB = calculateStats(dataForRangeB);

  if (!statsA || !statsB) {
    return (
      <div className="comparison-stats">
        No data available to compare.
      </div>
    );
  }

  return (
    <div className="comparison-stats">
      <h3>📊 Crypto Range Comparison</h3>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Range A</th>
            <th>Range B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Avg Close Price</td>
            <td>${statsA.averageClose}</td>
            <td>${statsB.averageClose}</td>
          </tr>
          <tr>
            <td>Total Volume</td>
            <td>{statsA.totalVolume}</td>
            <td>{statsB.totalVolume}</td>
          </tr>
          <tr>
            <td>Average Volume/Day</td>
            <td>{statsA.avgVolume}</td>
            <td>{statsB.avgVolume}</td>
          </tr>
          <tr>
            <td>Max High</td>
            <td>${statsA.maxHigh}</td>
            <td>${statsB.maxHigh}</td>
          </tr>
          <tr>
            <td>Min Low</td>
            <td>${statsA.minLow}</td>
            <td>${statsB.minLow}</td>
          </tr>
          <tr>
            <td>Price Change (%)</td>
            <td>{statsA.priceChangePercent}%</td>
            <td>{statsB.priceChangePercent}%</td>
          </tr>
          <tr>
            <td>Volatility (%)</td>
            <td>{statsA.volatilityPercent}%</td>
            <td>{statsB.volatilityPercent}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonStats;
