import React from 'react';

export default function SnellenChart({ zoomLevel }) {
  return (
    <div className="flex justify-center">
      <div
        className="transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <img
          src="/snellenchart.png"
          alt="Snellen Eye Chart"
          className="w-full max-w-md mx-auto mt-4"
        />

      </div>
    </div>
  );
}
