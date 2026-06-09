import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ARC EKS Demo</h1>
        <p>
          This React app is built and deployed using GitHub Actions
          with self-hosted runners on EKS via Actions Runner Controller.
        </p>
        <ul>
          <li><strong>Test &amp; Lint:</strong> Runs on spot instances</li>
          <li><strong>Build:</strong> Runs on on-demand instances</li>
          <li><strong>Deploy:</strong> Runs on spot instances</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
