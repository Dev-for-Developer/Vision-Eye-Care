import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/vision')
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
    <div className="App">
      <h1>Virtual Eye Test</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
