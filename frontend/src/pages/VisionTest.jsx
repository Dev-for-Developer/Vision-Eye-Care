import React, { useState } from "react";

const API_BASE = "http://localhost:8000/api"; // adjust if you proxy

export default function VisionTest() {
  const originalUrl = "/snellenchart.png";

  const [defocusD, setDefocusD] = useState(0.0);
  const [pupil, setPupil]       = useState(3.0);
  const [pxPerMm, setPxPerMm]   = useState(4.0);
  const [chromatic, setChromatic] = useState("achromatic");
  const [contrast, setContrast] = useState(1.0);
  const [gamma, setGamma]       = useState(1.0);

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
      const data = await res.json();
      if (!res.ok || (data.status && data.status !== "ok")) {
        throw new Error(data.message || "Server error");
      }
      const b64 = data.image_base64 || data.image || data.processed_base64;
      if (!b64) throw new Error("Empty image from server");
      setProcessedUrl(`data:image/png;base64,${b64}`);
    } catch (e) {
      setError(e.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10">
      <div className="container-page">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Virtual Eye Test — Phase 2</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls (left) */}
          <aside className="lg:col-span-3">
            <div className="card sticky top-24">
              <div className="card-body space-y-4">
                <h2 className="section-h">Optics</h2>

                <div>
                  <label className="block text-sm mb-1">
                    Defocus (Diopters): {defocusD.toFixed(2)} D
                  </label>
                  <input type="range" min={-6} max={6} step={0.25}
                         value={defocusD}
                         onChange={(e)=>setDefocusD(parseFloat(e.target.value))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Pupil size: {pupil.toFixed(2)} mm
                  </label>
                  <input type="range" min={2} max={7} step={0.1}
                         value={pupil}
                         onChange={(e)=>setPupil(parseFloat(e.target.value))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Pixels per mm (screen): {pxPerMm.toFixed(2)}
                  </label>
                  <input type="range" min={2} max={8} step={0.1}
                         value={pxPerMm}
                         onChange={(e)=>setPxPerMm(parseFloat(e.target.value))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm mb-1">Chromatic mode</label>
                  <select value={chromatic}
                          onChange={(e)=>setChromatic(e.target.value)}
                          className="bg-neutral-800 border border-neutral-700 px-2 py-1 rounded w-full">
                    <option value="achromatic">Achromatic (RGB together)</option>
                    <option value="chromatic_rgb">Chromatic (R/B split)</option>
                  </select>
                </div>

                <h2 className="section-h pt-2">Perceptual</h2>

                <div>
                  <label className="block text-sm mb-1">Contrast: {contrast.toFixed(2)}×</label>
                  <input type="range" min={0.6} max={1.5} step={0.05}
                         value={contrast}
                         onChange={(e)=>setContrast(parseFloat(e.target.value))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm mb-1">Gamma: {gamma.toFixed(2)}</label>
                  <input type="range" min={0.8} max={1.4} step={0.02}
                         value={gamma}
                         onChange={(e)=>setGamma(parseFloat(e.target.value))}
                         className="w-full" />
                </div>

                <button onClick={runSimulation} disabled={loading} className="btn-primary w-full">
                  {loading ? "Processing…" : "Run Simulation"}
                </button>

                {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              </div>
            </div>
          </aside>

          {/* Charts (right) */}
          <section className="lg:col-span-9">
            <h2 className="section-h mb-4">Chart Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <figure className="card">
                <div className="card-body">
                  <figcaption className="text-sm font-medium mb-2">Original</figcaption>
                  <div className="w-full aspect-[4/5]">
                    <img src={originalUrl} alt="Original Snellen Chart"
                         className="w-full h-full object-contain" draggable={false}/>
                  </div>
                </div>
              </figure>

              <figure className="card">
                <div className="card-body">
                  <figcaption className="text-sm font-medium mb-2">Processed</figcaption>
                  <div className="w-full aspect-[4/5] flex items-center justify-center">
                    {processedUrl ? (
                      <img src={processedUrl} alt="Processed Simulation"
                           className="w-full h-full object-contain" draggable={false}/>
                    ) : (
                      <p className="caption text-center">
                        Adjust controls and click <b>Run Simulation</b> to render the simulated chart.
                      </p>
                    )}
                  </div>
                </div>
              </figure>
            </div>
            <p className="caption mt-4">
              Letters are scaled using your “pixels/mm” setting to keep geometry coherent.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
