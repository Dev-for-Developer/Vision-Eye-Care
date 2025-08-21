// frontend/src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="relative">
      <div className="container mx-auto px-4">
        <div className="min-h-[calc(100vh-56px)] grid place-items-center">
          <div className="max-w-3xl text-center">
            <h1 className="font-extrabold tracking-tight leading-tight
                           text-4xl sm:text-5xl lg:text-6xl">
              Virtual Eye Test
            </h1>
            <p className="mt-4 text-neutral-300 text-base sm:text-lg">
              Test your vision at home with scientifically informed optics
              simulation. Accurate, accessible, and privacy-first.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/test"
                className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700
                           px-5 py-3 text-white font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/instructions"
                className="inline-flex items-center rounded-md border border-neutral-700
                           hover:bg-neutral-800 px-5 py-3 text-neutral-100 font-medium"
              >
                Read Instructions
              </Link>
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              Disclaimer: This is an informational tool, not a medical diagnosis.  
              Please consult an eye-care professional for prescriptions or concerns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
