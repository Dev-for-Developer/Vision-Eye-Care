import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function VisionCheck() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h2 className="text-2xl font-semibold mb-6">Do you already use glasses?</h2>
      <div className="flex gap-6">
        <button
          onClick={() => navigate('/test')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Yes
        </button>
        <button
          onClick={() => navigate('/test')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          No
        </button>
      </div>
    </div>
  )
}
