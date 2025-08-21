import React, { useState } from "react";
import Layout from "../components/Layout";

const API_BASE = "http://localhost:8000/api"; // change if you proxy

export default function VisionTest() {
  const originalUrl = "/snellenchart.png";

  // Controls
  const [defocusD, setDefocusD] = useState(0.0);
  const [pupil, setPupil] = useState(3.0);
  const [pxPerMm, setPxPerMm] = useState(4.0);
  const [chromatic, setChromatic] = useState("achromatic");
  const [contrast, setContrast] = useState(1.0);
  const [gamma, setGamma] = useState(1.0);

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

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response (not JSON).");
      }
      if (!res.ok || (data.status && data.status !== "ok")) {
        throw new Error(data.message || "Server error");
      }
      const b64 = data.image_base64 || data.image || data.processed_base64;
      if (!b64 || b64.length < 100) throw new Error("Empty image from server.");
      setProcessedUrl(`data:image/png;base64,${b64}`);
    } catch (e) {
      setError(e.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Virtual Eye Test — Phase 2</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        {/* Controls */}
        <aside className="bg-neutral-800/40 border border-neutral-700 rounded-xl p-5 h-fit">
          <h2 className="text-lg font-semibold mb-4">Optics</h2>

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
            className="w-full mb-4"
          />

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
            className="w-full mb-4"
          />

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
            className="w-full mb-4"
          />

          <label className="block text-sm mb-1">Chromatic mode</label>
          <select
            value={chromatic}
            onChange={(e) => setChromatic(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 px-2 py-2 rounded w-full mb-6"
          >
            <option value="achromatic">Achromatic (RGB together)</option>
            <option value="chromatic_rgb">Chromatic (R/B split)</option>
          </select>

          <h2 className="text-lg font-semibold mb-3">Perceptual</h2>

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
            className="w-full mb-4"
          />

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
            className="w-full mb-6"
          />

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Processing…" : "Run Simulation"}
          </button>

          {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}
        </aside>

        {/* Charts */}
        <section className="bg-neutral-800/40 border border-neutral-700 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Chart Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Original</h3>
              <div className="aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700">
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
              <div className="aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700 flex items-center justify-center">
                {processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Processed Simulation"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <p className="text-neutral-400 text-sm text-center px-3">
                    Adjust controls and click <b>Run Simulation</b> to render
                    the simulated chart.
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            Letters are scaled using your “pixels/mm” setting to keep geometry
            coherent.
          </p>
        </section>
      </div>
    </Layout>
  );
}
