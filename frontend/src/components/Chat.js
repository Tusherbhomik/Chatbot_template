import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
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
      const aiMessage = { text: response.data.response, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Add error message to chat
      const errorMessage = { 
        text: 'Sorry, there was an error processing your request.', 
        sender: 'ai' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Start a conversation with Gemini!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message ai">
            <div className="message-bubble">
              <p className="loading">Thinking<span>.</span><span>.</span><span>.</span></p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || input.trim() === ''}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;