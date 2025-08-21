// frontend/src/pages/VisionTest.jsx
import React, { useState } from "react";

const API_BASE = "http://localhost:8000/api";

export default function VisionTest() {
  const originalUrl = "/snellenchart.png";

  const [defocusD, setDefocusD] = useState(0.0);
  const [pupil, setPupil] = useState(3.0);
  const [pxPerMm, setPxPerMm] = useState(4.0);
  const [chromatic, setChromatic] = useState("achromatic");
  const [contrast, setContrast] = useState(1.0);
  const [gamma, setGamma] = useState(1.0);

  const [loading, setLoading] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState("");

  async function runSimulation() {
    setLoading(true);
    setError("");
    setProcessedUrl(null);
    try {
      const res = await fetch(`${API_BASE}/simulate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defocus_D: defocusD,
          pupil_mm: pupil,
          px_per_mm: pxPerMm,
          chromatic_mode: chromatic,
          contrast,
          gamma,
        }),
      });
      const data = await res.json();
      if (!res.ok || (data.status && data.status !== "ok"))
        throw new Error(data.message || "Server error");
      const b64 = data.image_base64 || data.image || data.processed_base64;
      if (!b64 || b64.length < 64)
        throw new Error("Received invalid image from server");
      setProcessedUrl(`data:image/png;base64,${b64}`);
    } catch (e) {
      setError(e.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Virtual Eye Test — Phase 2</h1>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-8">
          {/* LEFT: Controls (sticky card) */}
          <aside className="lg:sticky lg:top-20 h-fit">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
              <h2 className="text-lg font-semibold mb-4">Optics</h2>

              <Label text={`Defocus (Diopters): ${defocusD.toFixed(2)} D`} />
              <Range min={-6} max={6} step={0.25} value={defocusD} onChange={setDefocusD} />

              <Label text={`Pupil size: ${pupil.toFixed(2)} mm`} />
              <Range min={2} max={7} step={0.1} value={pupil} onChange={setPupil} />

              <Label text={`Pixels per mm (screen): ${pxPerMm.toFixed(2)}`} />
              <Range min={2} max={8} step={0.1} value={pxPerMm} onChange={setPxPerMm} />

              <div className="mt-3">
                <label className="block text-sm text-neutral-300 mb-1">Chromatic mode</label>
                <select
                  value={chromatic}
                  onChange={(e) => setChromatic(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 rounded-md"
                >
                  <option value="achromatic">Achromatic (RGB together)</option>
                  <option value="chromatic_rgb">Chromatic (R/B split)</option>
                </select>
              </div>

              <h2 className="text-lg font-semibold mt-6 mb-2">Perceptual</h2>

              <Label text={`Contrast: ${contrast.toFixed(2)}×`} />
              <Range min={0.6} max={1.5} step={0.05} value={contrast} onChange={setContrast} />

              <Label text={`Gamma: ${gamma.toFixed(2)}`} />
              <Range min={0.8} max={1.4} step={0.02} value={gamma} onChange={setGamma} />

              <button
                onClick={runSimulation}
                disabled={loading}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 rounded-md
                           bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Processing…" : "Run Simulation"}
              </button>

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
          </aside>

          {/* RIGHT: Side-by-side charts */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h2 className="text-lg font-semibold mb-4 text-center">Chart Comparison</h2>

            {/* Force 2 columns always */}
            <div className="grid grid-cols-2 gap-6">
              {/* Original */}
              <figure className="text-center">
                <figcaption className="text-sm font-medium mb-2">Original</figcaption>
                <div className="bg-neutral-800 rounded-lg overflow-hidden">
                  <img
                    src={originalUrl}
                    alt="Original Snellen Chart"
                    className="w-full max-h-[70vh] object-contain"
                    draggable={false}
                  />
                </div>
              </figure>

              {/* Processed */}
              <figure className="text-center">
                <figcaption className="text-sm font-medium mb-2">Processed</figcaption>
                <div className="bg-neutral-800 rounded-lg overflow-hidden grid place-items-center">
                  {processedUrl ? (
                    <img
                      src={processedUrl}
                      alt="Processed Simulation"
                      className="w-full max-h-[70vh] object-contain"
                      draggable={false}
                    />
                  ) : (
                    <p className="text-neutral-400 text-sm px-3 text-center">
                      Adjust controls and click <b>Run Simulation</b>.
                    </p>
                  )}
                </div>
              </figure>
            </div>

            <p className="text-xs text-neutral-400 mt-4 text-center">
              Letters are scaled by your device pixels/mm setting to keep geometry coherent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({ text }) {
  return <label className="block text-sm text-neutral-300 mt-3 mb-1">{text}</label>;
}
function Range({ min, max, step, value, onChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full"
    />
  );
}
