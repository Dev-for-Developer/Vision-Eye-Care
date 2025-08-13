import React, { useState } from "react";

export default function VisionTest() {
  const [lensPower, setLensPower] = useState(0);
  const [blurLevel, setBlurLevel] = useState(0);

  // Placeholder function for lens simulation
  const simulateVision = (power) => {
    // In Phase 2, we will replace this with actual optical simulation
    // For now: higher difference from 0 => more blur
    return Math.abs(power) * 1.5; // Adjust multiplier for effect
  };

  const handleLensChange = (e) => {
    const value = parseFloat(e.target.value);
    setLensPower(value);
    setBlurLevel(simulateVision(value));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Virtual Eye Vision Test</h1>

      {/* Snellen Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Snellen Chart</h2>
        <div className="flex flex-col items-center space-y-4">
          {[
            "E",
            "F P",
            "T O Z",
            "L P E D",
            "P E C F D",
            "E D F C Z P",
            "F E L O P Z D"
          ].map((line, index) => (
            <p
              key={index}
              className="font-bold"
              style={{
                fontSize: `${48 - index * 5}px`,
                filter: `blur(${blurLevel}px)`
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Lens Power Selector */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Adjust Lens Power</h2>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.25"
          value={lensPower}
          onChange={handleLensChange}
          className="w-full accent-blue-500"
        />
        <p className="mt-2 text-lg">
          Selected Power: <span className="font-bold">{lensPower} D</span>
        </p>
      </div>
    </div>
  );
}
