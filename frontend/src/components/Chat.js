// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input field on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, userMessage]);
    
    // Clear input field
    setInput('');
    
    // Set loading state
    setLoading(true);
    
    try {
      // Send request to backend API
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: input
      });
      
      // Add AI response to chat
      const aiMessage = { 
        text: response.data.response, 
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Add error message to chat
      const errorMessage = { 
        text: 'Sorry, there was an error processing your request.', 
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
      // Re-focus the input field
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-status">
          <span className="status-indicator online"></span>
          <span>Gemini AI</span>
        </div>
      </div>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <h3>Start a conversation with Gemini</h3>
            <p>Ask a question or start a conversation to see Gemini in action.</p>
          </div>
        ) : (
          <div className="messages-wrapper">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                  </div>
                  <div className="message-info">
                    <span className="message-time">{msg.timestamp}</span>
                    {msg.sender === 'user' && <span className="message-status">✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="message ai">
            <div className="message-content">
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSend}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || input.trim() === ''}
            className={input.trim() !== '' ? 'active' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;