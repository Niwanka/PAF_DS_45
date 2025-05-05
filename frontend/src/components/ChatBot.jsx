import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getDummyResponse = (question) => {
    const responses = {
      default: "I'm sorry, I don't have specific information about that. Could you ask something else?",
      greeting: "Hello! How can I help you today?",
      help: "I can help you with information about web development, programming languages, job searching tips, and more. What would you like to know about?",
      react: "React is a JavaScript library for building user interfaces. It's maintained by Facebook and a community of developers. React makes it painless to create interactive UIs.",
      javascript: "JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications.",
      nodejs: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side.",
      skill: "Some in-demand skills for developers include: React, Node.js, TypeScript, Cloud services (AWS/Azure/GCP), and data structures & algorithms."
    };

    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi ")) {
      return responses.greeting;
    } else if (lowerQuestion.includes("help") || lowerQuestion.includes("can you")) {
      return responses.help;
    } else if (lowerQuestion.includes("react")) {
      return responses.react;
    } else if (lowerQuestion.includes("javascript") || lowerQuestion.includes("js")) {
      return responses.javascript;
    } else if (lowerQuestion.includes("node")) {
      return responses.nodejs;
    } else if (lowerQuestion.includes("skill")) {
      return responses.skill;
    }
    
    return responses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!API_KEY) {
        throw new Error('API key not found');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: userMessage
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.candidates[0]?.content?.parts[0]?.text || getDummyResponse(userMessage);
      
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to dummy response
      const fallbackResponse = getDummyResponse(userMessage);
      setMessages(prev => [...prev, { text: fallbackResponse, isUser: false }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chatbot-modern">
      <div className="chatbot-header">
        <div className="header-content">
          <div className="bot-status">
            <span className="status-dot"></span>
            <span className="status-text">AI Assistant Online</span>
          </div>
          <button className="minimize-btn">
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.isUser ? 'user-bubble' : 'bot-bubble'}`}>
            {!message.isUser && (
              <div className="bot-avatar">
                <i className="fas fa-robot"></i>
              </div>
            )}
            <div className="bubble-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble bot-bubble">
            <div className="bot-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="bubble-content">
              <div className="typing-bubble">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="modern-input"
        />
        <button 
          className="send-button-modern" 
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;