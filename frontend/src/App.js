import React from 'react';
import './App.css';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gemini Chatbot</h1>
      </header>
      <main>
        <Chat />
      </main>
      <footer>
        <p>Powered by Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
}

export default App;