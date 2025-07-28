import React from "react";
import './DateRangePicker.css'

export const DateRangePicker = ({ label, onChange }) => {
  const [range, setRange] = React.useState({ from: null, to: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...range, [name]: value };
    setRange(newRange);
    onChange(newRange);
  };

  return (
    <div className="date-range-picker">
      <label>{label}</label>
      <input type="date" name="from" onChange={handleChange} />
      <input type="date" name="to" onChange={handleChange} />
    </div>
  );
};

