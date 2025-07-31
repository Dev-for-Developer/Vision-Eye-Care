import { useEffect, useState } from 'react';
import './App.css';
import './output.css';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/vision/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setStatus(`Backend Status: ${data.status}`);
      })
      .catch((err) => {
        setStatus(`Backend Status: Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="App text-center p-10">
      <h1 className="text-3xl font-bold mb-4">Virtual Eye Test</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
}

export default App;
