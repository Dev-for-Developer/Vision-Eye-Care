import { Routes, Route, NavLink } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import VisionCheck from "./pages/VisionCheck.jsx";
import VisionTest from "./pages/VisionTest.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import InstructionManual from "./pages/InstructionManual.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* simple header */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
        <div className="container-page flex items-center justify-between py-3">
          <NavLink to="/" className="text-lg font-semibold">
            Virtual Eye Test
          </NavLink>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/test" className="hover:text-blue-300">Test</NavLink>
            <NavLink to="/instructions" className="hover:text-blue-300">Instructions</NavLink>
            <NavLink to="/vision-check" className="hover:text-blue-300">Vision Check</NavLink>
            <NavLink to="/report" className="hover:text-blue-300">Report</NavLink>
          </nav>
        </div>
      </header>

      {/* routes */}
      <main className="container-page py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/instructions" element={<InstructionManual />} />
          <Route path="/vision-check" element={<VisionCheck />} />
          <Route path="/test" element={<VisionTest />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
    </div>
  );
}
