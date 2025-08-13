import React from "react";

const LensPowerSelector = ({ lensPower, setLensPower }) => {
  const handlePowerChange = (e) => {
    setLensPower(parseFloat(e.target.value));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-blue-700 mb-2">Lens Power</h2>
      <input
        type="range"
        min={-6}
        max={6}
        step={0.25}
        value={lensPower}
        onChange={handlePowerChange}
        className="w-full accent-blue-600"
      />
      <p className="text-center mt-2 font-medium text-blue-800">
        {lensPower.toFixed(2)} D
      </p>
    </div>
  );
};

export default LensPowerSelector;
