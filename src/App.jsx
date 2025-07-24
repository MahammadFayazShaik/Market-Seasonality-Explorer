// src/App.jsx
import React from "react";
import MarketDashboard from "./pages/MarketDashboard";

const App = () => {
  return (
    <div className="app dark bg-[#0f0f0f] min-h-screen">
      <main className="p-4">
        <MarketDashboard />
      </main>
    </div>
  );
};

export default App;
