import React from "react";
import { NavLink } from "react-router-dom";
import AuthButton from "./AuthButton";

export default function NavBar() {
  const linkCls = "px-3 py-2 rounded-md text-sm hover:bg-neutral-800/60";
  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-900/80 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <div className="text-blue-400 font-semibold">Virtual Eye Test</div>
          <div className="flex items-center gap-2">
            <NavLink to="/test" className={linkCls}>Test</NavLink>
            <NavLink to="/instructions" className={linkCls}>Instructions</NavLink>
            <NavLink to="/vision-check" className={linkCls}>Vision Check</NavLink>
            <NavLink to="/report" className={linkCls}>Report</NavLink>
          </div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
