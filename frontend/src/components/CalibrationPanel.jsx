// src/components/CalibrationPanel.jsx
import React, { useEffect, useState } from "react";

const CARD_WIDTH_MM = 85.6;

export default function CalibrationPanel({ pxPerMM, setPxPerMM, distanceM, setDistanceM }) {
  const [cardWidthPx, setCardWidthPx] = useState(300);

  useEffect(() => {
    if (cardWidthPx > 0) {
      setPxPerMM(cardWidthPx / CARD_WIDTH_MM);
    }
  }, [cardWidthPx, setPxPerMM]);

  return (
    <div className="rounded-2xl p-4 bg-zinc-800/40 border border-zinc-700">
      <h3 className="text-lg font-semibold mb-3">Calibration</h3>

      <div className="space-y-2">
        <label className="text-sm opacity-80">
          1) Hold a real **credit/debit card** to the screen and drag until the blue card matches its width.
        </label>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={120}
            max={520}
            value={cardWidthPx}
            onChange={(e) => setCardWidthPx(Number(e.target.value))}
            className="w-full"
          />
          <div
            style={{ width: cardWidthPx, height: (cardWidthPx * 54) / 85.6 }}
            className="rounded-md bg-blue-500/30 border border-blue-400"
            title="Match this to your physical card width"
          />
        </div>

        <div className="text-sm">
          Pixels/mm (estimated):{" "}
          <span className="font-mono">{pxPerMM ? pxPerMM.toFixed(2) : "--"}</span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label className="text-sm opacity-80">2) Viewing distance (meters)</label>
        <input
          type="number"
          step="0.1"
          min="0.3"
          value={distanceM}
          onChange={(e) => setDistanceM(Number(e.target.value))}
          className="w-32 rounded-md border border-zinc-600 bg-zinc-900 px-2 py-1"
          placeholder="e.g. 3"
        />
        <p className="text-xs opacity-70">
          Tip: Sit at 3 m (≈10 ft) if you have space. Letters scale precisely using angular size.
        </p>
      </div>
    </div>
  );
}
