import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Virtual Eye Test
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
          Test your vision online from the comfort of your home. Our physics-aware
          simulator shows how your vision changes with lens power, pupil size, and more.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/test"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
          >
            Get Started
          </Link>
          <Link
            to="/instructions"
            className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-800"
          >
            Read Instructions
          </Link>
        </div>
      </div>
    </section>
  );
}
