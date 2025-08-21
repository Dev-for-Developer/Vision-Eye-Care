import React from "react";
import { NavLink } from "react-router-dom";

const link =
  "px-3 py-2 rounded-md text-sm font-medium hover:bg-neutral-800/60 transition-colors";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="text-blue-400 font-semibold">Virtual Eye Test</div>
          <div className="flex items-center gap-1">
            <NavLink to="/test" className={link}>Test</NavLink>
            <NavLink to="/instructions" className={link}>Instructions</NavLink>
            <NavLink to="/vision-check" className={link}>Vision Check</NavLink>
            <NavLink to="/report" className={link}>Report</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
