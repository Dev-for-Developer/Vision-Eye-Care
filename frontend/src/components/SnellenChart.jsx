import React from "react";

const SnellenChart = ({ zoomLevel }) => {
  const zoomStyles = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: "top center",
    transition: "transform 0.3s ease-in-out",
  };

  return (
    <div className="w-full overflow-hidden">
      <img
        src="/snellenchart.png"
        alt="Snellen Eye Chart"
        style={zoomStyles}
        className="mx-auto max-h-[80vh] object-contain"
      />
    </div>
  );
};

export default SnellenChart;
