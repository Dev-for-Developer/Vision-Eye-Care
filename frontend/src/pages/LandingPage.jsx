import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="min-h-[calc(100vh-56px)] flex items-center">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Virtual Eye Test
          </h1>
          <p className="mt-4 text-neutral-300 max-w-prose">
            Test your vision at home using physics-based optics and perceptual simulation.
            Get an intuitive, side-by-side chart that reacts to lens power, pupil size,
            contrast and more.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/test" className="btn-primary">Get Started</Link>
            <Link to="/instructions" className="btn-ghost">Read Instructions</Link>
          </div>
          <p className="mt-6 text-xs text-neutral-400 max-w-prose">
            This prototype is for education and pre-screening only. It does not replace a
            comprehensive eye exam by an optometrist/ophthalmologist.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="card">
            <div className="card-body">
              <div className="w-full aspect-[4/5]">
                <img
                  src="/snellenchart.png"
                  className="w-full h-full object-contain rounded"
                  alt="Snellen chart"
                  draggable={false}
                />
              </div>
              <p className="caption mt-3">Sample Snellen chart used for calibration and testing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
