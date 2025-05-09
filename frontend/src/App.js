// App.js
import React from 'react';
import './App.css';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gemini AI Assistant</h1>
      </header>
      <main>
        <Chat />
      </main>
      <footer>
        <p>Powered by Google Gemini 2.0 • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;