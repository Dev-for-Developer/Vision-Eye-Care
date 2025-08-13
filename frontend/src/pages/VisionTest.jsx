import React, { useState } from "react";
import SnellenChart from "../component/SnellenChart";
import ZoomControl from "../component/ZoomControl";
import LensPowerSelector from "../component/LensPowerSelector";

const VisionTest = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lensPower, setLensPower] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-6">
          Virtual Vision Test
        </h1>

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Snellen Chart */}
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-6 shadow-md">
            <SnellenChart zoomLevel={zoomLevel} />
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6 justify-between">
            <div className="bg-blue-50 p-4 rounded-xl shadow-md">
              <ZoomControl zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl shadow-md">
              <LensPowerSelector
                lensPower={lensPower}
                setLensPower={setLensPower}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mt-2">
                Adjust the zoom level and lens power until the chart is clearest to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionTest;
