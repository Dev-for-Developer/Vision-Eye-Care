// frontend/src/App.jsx
import { Link, NavLink, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VisionCheck from "./pages/VisionCheck";
import VisionTest from "./pages/VisionTest";
import ReportPage from "./pages/ReportPage";
import InstructionManual from "./pages/InstructionManual";

function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur border-b border-neutral-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold tracking-tight text-neutral-100">
          Virtual Eye Test
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/test" className={({isActive}) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Test</NavLink>
          <NavLink to="/vision-check" className={({isActive}) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Pre-check</NavLink>
          <NavLink to="/instructions" className={({isActive}) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Instructions</NavLink>
          <NavLink to="/report" className={({isActive}) => isActive ? "text-white" : "text-neutral-300 hover:text-white"}>Report</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-900 text-neutral-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vision-check" element={<VisionCheck />} />
          <Route path="/test" element={<VisionTest />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/instructions" element={<InstructionManual />} />
        </Routes>
      </main>
    </>
  );
}
