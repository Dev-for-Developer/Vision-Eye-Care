import React from 'react';
import SnellenChart from '../components/SnellenChart';

export default function VisionTest() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold text-center my-6">Virtual Eye Test</h1>
      <SnellenChart />
    </div>
  );
}
