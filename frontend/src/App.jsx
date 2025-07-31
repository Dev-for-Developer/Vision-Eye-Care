import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import VisionCheck from './pages/VisionCheck'
import VisionTest from './pages/VisionTest'
import ReportPage from './pages/ReportPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/vision-check" element={<VisionCheck />} />
      <Route path="/test" element={<VisionTest />} />
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  )
}
