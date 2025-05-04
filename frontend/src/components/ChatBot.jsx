import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Check if API key exists
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    console.error('Missing Gemini API key');
  }

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!API_KEY) {
      setMessages(prev => [...prev, { 
        text: "Error: Missing API key. Please configure the environment variables.", 
        isUser: false 
      }]);
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const prompt = userMessage.trim();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { text, isUser: false }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message || 'Something went wrong. Please try again.'}`, 
        isUser: false 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <i className="fas fa-robot"></i>
        <h3>AI Assistant</h3>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
        />
        <button className="send-button" onClick={handleSend}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;