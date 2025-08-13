import React from 'react';

export default function LensPowerSelector({ selectedPower, setSelectedPower }) {
  return (
    <div className="flex flex-col items-center my-4">
      <label className="mb-2 font-semibold">Lens Power (Diopters)</label>
      <input
        type="range"
        min="-10"
        max="10"
        step="0.25"
        value={selectedPower}
        onChange={(e) => setSelectedPower(parseFloat(e.target.value))}
        className="w-64"
      />
      <span className="mt-2 text-sm">{selectedPower >= 0 ? '+' : ''}{selectedPower} D</span>
    </div>
  );
}
