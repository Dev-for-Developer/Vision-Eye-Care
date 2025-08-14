// frontend/src/pages/VisionTest.jsx
import React, { useState } from "react";

export default function VisionTest() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Scientific controls
  const [diopters, setDiopters] = useState(0.0);     // -6 to +6
  const [pupil, setPupil] = useState(3.0);           // 2 to 6 mm
  const [contrast, setContrast] = useState(1.0);     // 0.5 to 1.2
  const [gamma, setGamma] = useState(1.0);           // 0.7 to 1.5
  const [lambdaNm, setLambdaNm] = useState("none");  // "none" or 470/555/610

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setErr("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const runSim = async () => {
    if (!file) {
      setErr("Please select an image first.");
      return;
    }
    setLoading(true);
    setErr("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("diopters", String(diopters));
      fd.append("pupil_mm", String(pupil));
      fd.append("contrast", String(contrast));
      fd.append("gamma", String(gamma));
      fd.append("wavelength_nm", lambdaNm); // "none" or number

      const res = await fetch("http://127.0.0.1:8000/api/simulate/", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const data = await res.json();
      setResult(data.image); // data URL
    } catch (e) {
      setErr(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const sliderCls =
    "w-full accent-blue-500";
  const boxCls =
    "rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Virtual Eye Test — Phase 2</h1>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={boxCls}>
            <h2 className="font-semibold mb-3">Upload</h2>
            <input
              type="file"
              accept="image/*"
              onChange={onPick}
              className="block w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use a Snellen chart image or any high-contrast scene.
            </p>
          </div>

          <div className={boxCls}>
            <h2 className="font-semibold mb-3">Optics</h2>
            <label className="text-sm">Defocus (Diopters): {diopters.toFixed(2)} D</label>
            <input
              type="range"
              min={-6}
              max={6}
              step={0.25}
              value={diopters}
              onChange={(e) => setDiopters(parseFloat(e.target.value))}
              className={sliderCls}
            />
            <label className="text-sm mt-3 block">Pupil Size: {pupil.toFixed(1)} mm</label>
            <input
              type="range"
              min={2}
              max={6}
              step={0.1}
              value={pupil}
              onChange={(e) => setPupil(parseFloat(e.target.value))}
              className={sliderCls}
            />

            <label className="text-sm mt-4 block">Chromatic (λ):</label>
            <select
              value={lambdaNm}
              onChange={(e) => setLambdaNm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
            >
              <option value="none">Achromatic (RGB)</option>
              <option value="470">470 nm (Blue)</option>
              <option value="555">555 nm (Green)</option>
              <option value="610">610 nm (Red)</option>
            </select>
          </div>

          <div className={boxCls}>
            <h2 className="font-semibold mb-3">Perceptual</h2>
            <label className="text-sm">Contrast: {contrast.toFixed(2)}×</label>
            <input
              type="range"
              min={0.5}
              max={1.2}
              step={0.05}
              value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
              className={sliderCls}
            />
            <label className="text-sm mt-3 block">Gamma: {gamma.toFixed(2)}</label>
            <input
              type="range"
              min={0.7}
              max={1.5}
              step={0.05}
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className={sliderCls}
            />

            <button
              onClick={runSim}
              disabled={loading || !file}
              className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5"
            >
              {loading ? "Running Simulation…" : "Run Simulation"}
            </button>
            {err && <p className="text-red-500 text-sm mt-3">{err}</p>}
          </div>
        </div>

        {/* Previews */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={boxCls}>
            <h3 className="font-semibold mb-3">Original</h3>
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="original" className="w-full h-full object-contain" />
              ) : (
                <span className="text-sm text-gray-500">No image selected</span>
              )}
            </div>
          </div>

          <div className={boxCls}>
            <h3 className="font-semibold mb-3">Simulated Retina</h3>
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
              {result ? (
                <img src={result} alt="result" className="w-full h-full object-contain" />
              ) : (
                <span className="text-sm text-gray-500">Run the simulation to see the output</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
