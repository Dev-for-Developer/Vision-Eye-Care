import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Virtual Eye Test</h1>
      <p className="mb-6 text-gray-700 text-lg">Test your vision online from the comfort of your home.</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
        onClick={() => navigate('/vision-check')}
      >
        Get Started
      </button>
    </div>
  )
}
