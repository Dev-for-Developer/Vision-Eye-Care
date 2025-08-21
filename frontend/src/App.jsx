import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VisionTest from "./pages/VisionTest";
import InstructionManual from "./pages/InstructionManual";
import VisionCheck from "./pages/VisionCheck";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/test" element={<VisionTest />} />
      <Route path="/instructions" element={<InstructionManual />} />
      <Route path="/vision-check" element={<VisionCheck />} />
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  );
}
