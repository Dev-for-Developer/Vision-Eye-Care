import React from 'react';

export default function ZoomControl({ zoomLevel, setZoomLevel }) {
  return (
    <div className="flex flex-col items-center my-4">
      <label className="mb-2 font-semibold">Zoom Chart</label>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={zoomLevel}
        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
        className="w-48"
      />
      <span className="mt-2 text-sm">Zoom: {zoomLevel}x</span>
    </div>
  );
}
