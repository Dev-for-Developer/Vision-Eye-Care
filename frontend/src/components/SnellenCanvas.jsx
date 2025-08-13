// src/components/SnellenCanvas.jsx
import React from "react";
import { pxForSnellenDenom } from "../utils/vision";

// Standard Sloan letters per row (sample set)
const LINES = [
  { denom: 200, text: "E" },
  { denom: 100, text: "FP" },
  { denom: 70,  text: "TOZ" },
  { denom: 50,  text: "LPED" },
  { denom: 40,  text: "PECFD" },
  { denom: 30,  text: "EDFCZP" },
  { denom: 25,  text: "FELPZD" },
  { denom: 20,  text: "DEFPOTEC" },
  { denom: 15,  text: "LEFODPCT" },
  { denom: 10,  text: "FPZLO" }
];

export default function SnellenCanvas({ pxPerMM, distanceM }) {
  if (!pxPerMM || !distanceM) {
    return (
      <div className="text-sm opacity-70">
        Calibrate first (pixels/mm and distance) to render true-size letters.
      </div>
    );
  }

  // Layout constants
  const ROW_GAP = 16; // px gap between lines (visual spacing)
  const WIDTH = 720;
  let y = 0;

  return (
    <svg width={WIDTH} height="1100" className="bg-white rounded-xl shadow-md">
      <rect x="0" y="0" width={WIDTH} height="1100" fill="white" />

      {LINES.map((line, idx) => {
        const letterPx = pxForSnellenDenom(line.denom, distanceM, pxPerMM);
        const fontSize = letterPx; // font-size approximates optotype height

        // vertical advance: letter height + gap
        const rowY = (y += fontSize + ROW_GAP);

        return (
          <g key={idx} transform={`translate(20, ${rowY})`}>
            {/* Letters */}
            <text
              x="0"
              y="0"
              fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
              fontWeight="700"
              fontSize={fontSize}
              dominantBaseline="hanging"
              fill="#111"
              letterSpacing="4"
            >
              {line.text}
            </text>

            {/* Denominator label on right */}
            <text
              x={WIDTH - 100}
              y={fontSize * 0.1}
              fontSize="18"
              fill="#444"
              dominantBaseline="hanging"
            >
              20/{line.denom}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
