// src/App.jsx
import React from "react";
import Calendar from "./components/Calendar";
import TopNavbar from "./components/TopNavbar";

const App = () => {
  return (
    <div className="app dark bg-[#0f0f0f] min-h-screen">
      <TopNavbar />
      <main className="p-4">
        <Calendar />
      </main>
    </div>
  );
};

export default App;
