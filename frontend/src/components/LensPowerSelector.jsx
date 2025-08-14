// src/components/LensPowerSelector.jsx
import React from "react";

const LensPowerSelector = ({ value, onChange }) => {
  return (
    <div className="flex flex-col items-start space-y-2">
      <label className="font-semibold">
        Lens Power (Diopters): {value}
      </label>
      <input
        type="range"
        min="-5"
        max="5"
        step="0.25"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-64"
      />
    </div>
  );
};

export default LensPowerSelector;
