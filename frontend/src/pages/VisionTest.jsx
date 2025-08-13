import React, { useState } from "react";
import SnellenChart from "../components/SnellenChart";
import ZoomControl from "../components/ZoomControl";
import LensPowerSelector from "../components/LensPowerSelector";

export default function VisionTest() {
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Virtual Vision Test</h1>

      <div className="mb-4">
        <ZoomControl zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      </div>

      <SnellenChart zoomLevel={zoomLevel} />

      <div className="mt-4">
        <LensPowerSelector />
      </div>
    </div>
  );
}
