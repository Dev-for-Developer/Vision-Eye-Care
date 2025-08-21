import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function LandingPage() {
  return (
    <Layout>
      <section className="flex flex-col items-center justify-center text-center min-h-[70vh]">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Virtual Eye Test
        </h1>
        <p className="max-w-2xl text-neutral-300 mb-8">
          Test your vision online from the comfort of your home. Our
          physics-aware simulator shows how your vision changes with lens
          power, pupil size, and more.
        </p>
        <div className="flex gap-3">
          <Link
            to="/test"
            className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/instructions"
            className="px-5 py-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors"
          >
            Read Instructions
          </Link>
        </div>
      </section>
    </Layout>
  );
}
