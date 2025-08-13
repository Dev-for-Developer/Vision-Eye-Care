import React from "react";

const ZoomControl = ({ zoomLevel, setZoomLevel }) => {
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div>
      <h2 className="text-lg font-semibold text-blue-700 mb-2">Zoom Control</h2>
      <div className="flex items-center gap-4">
        <button
          onClick={handleZoomOut}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg shadow hover:bg-red-200"
        >
          -
        </button>
        <span className="text-lg font-medium">{zoomLevel.toFixed(1)}x</span>
        <button
          onClick={handleZoomIn}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg shadow hover:bg-green-200"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ZoomControl;
