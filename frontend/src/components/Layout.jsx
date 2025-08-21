import React from "react";
import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-neutral-900 text-neutral-100 flex flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-neutral-800 text-neutral-400 text-sm py-4 text-center">
        © {new Date().getFullYear()} Virtual Eye Test
      </footer>
    </div>
  );
}
