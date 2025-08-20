// frontend/src/pages/VisionTest.jsx
import React, { useState } from "react";

const API_BASE = "http://localhost:8000/api"; // adjust if needed

export default function VisionTest() {
  // Original chart is always present (bundled in /public)
  const originalUrl = "/snellenchart.png";

  // Controls
  const [defocusD, setDefocusD] = useState(0.0);          // -6..+6
  const [pupil, setPupil] = useState(3.0);                // 2..7 mm
  const [pxPerMm, setPxPerMm] = useState(4.0);            // 2..8
  const [chromatic, setChromatic] = useState("achromatic"); // or "chromatic_rgb"
  const [contrast, setContrast] = useState(1.0);          // 0.6..1.5
  const [gamma, setGamma] = useState(1.0);                // 0.8..1.4

  const [loading, setLoading] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState("");

  const runSimulation = async () => {
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

      // Try to parse JSON either way
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response (not JSON).");
      }

      if (!res.ok || (data.status && data.status !== "ok")) {
        throw new Error(data.message || "Server error");
      }

      // Accept both possible keys from backend: image_base64 OR image
      const b64 =
        data.image_base64 ||
        data.image ||
        data.processed_base64 ||
        null;

      if (!b64 || typeof b64 !== "string" || b64.length < 100) {
        throw new Error("Received empty/invalid image from server.");
      }

      setProcessedUrl(`data:image/png;base64,${b64}`);
    } catch (e) {
      setError(e.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Virtual Eye Test — Phase 2</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Optics</h2>

            <div>
              <label className="block text-sm mb-1">
                Defocus (Diopters): {defocusD.toFixed(2)} D
              </label>
              <input
                type="range"
                min={-6}
                max={6}
                step={0.25}
                value={defocusD}
                onChange={(e) => setDefocusD(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Pupil size: {pupil.toFixed(2)} mm
              </label>
              <input
                type="range"
                min={2}
                max={7}
                step={0.1}
                value={pupil}
                onChange={(e) => setPupil(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Pixels per mm (screen): {pxPerMm.toFixed(2)}
              </label>
              <input
                type="range"
                min={2}
                max={8}
                step={0.1}
                value={pxPerMm}
                onChange={(e) => setPxPerMm(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Chromatic mode</label>
              <select
                value={chromatic}
                onChange={(e) => setChromatic(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 px-2 py-1 rounded"
              >
                <option value="achromatic">Achromatic (RGB together)</option>
                <option value="chromatic_rgb">Chromatic (R/B split)</option>
              </select>
            </div>

            <h2 className="text-xl font-semibold pt-4">Perceptual</h2>

            <div>
              <label className="block text-sm mb-1">
                Contrast: {contrast.toFixed(2)}×
              </label>
              <input
                type="range"
                min={0.6}
                max={1.5}
                step={0.05}
                value={contrast}
                onChange={(e) => setContrast(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Gamma: {gamma.toFixed(2)}
              </label>
              <input
                type="range"
                min={0.8}
                max={1.4}
                step={0.02}
                value={gamma}
                onChange={(e) => setGamma(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="mt-2 inline-flex items-center px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Processing…" : "Run Simulation"}
            </button>

            {error && (
              <p className="text-red-400 text-sm mt-2">Error: {error}</p>
            )}
          </div>

          {/* Side-by-side images */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Original</h3>
                <div className="aspect-[4/5] bg-neutral-800 rounded overflow-hidden">
                  <img
                    src={originalUrl}
                    alt="Original Snellen Chart"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Processed</h3>
                <div className="aspect-[4/5] bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
                  {processedUrl ? (
                    <img
                      src={processedUrl}
                      alt="Processed Simulation"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <p className="text-neutral-400 text-sm px-3 text-center">
                      Adjust controls and click <b>Run Simulation</b> to see the
                      simulated retina image here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-400">
          Letters are scaled by your device pixels/mm setting to keep geometry coherent.
        </p>
      </div>
    </div>
  );
}
