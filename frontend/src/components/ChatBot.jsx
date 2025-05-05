import React, { useState, useRef, useEffect } from 'react';

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

  // Use dummy responses for development when API is unavailable
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
      // Try to use the API if available, otherwise fall back to dummy responses
      let botResponse;
      
      try {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        
        // First try the v1 endpoint
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: userMessage }
                  ]
                }
              ]
            })
          }
        );

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0]) {
          botResponse = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Fall back to dummy responses
        botResponse = getDummyResponse(userMessage);
      }

      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('General Error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Let me try to help anyway: " + getDummyResponse(userMessage), 
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
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
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
        <button 
          className="send-button" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;