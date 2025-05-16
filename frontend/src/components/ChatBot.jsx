import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
    <div className={`fixed bottom-4 right-4 ${
      isMinimized 
        ? 'w-[250px] h-[60px]' 
        : 'w-[380px] h-[600px]'
    } transition-all duration-300 ease-in-out bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200`}>
      {/* Header - Updated for better alignment when minimized */}
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between h-[60px]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-2 h-2 bg-green-400 rounded-full absolute -right-1 -top-1"></div>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
            </div>
          </div>
          <div className="text-white">
            <h3 className="font-medium text-sm">AI Assistant</h3>
            <p className={`text-xs text-indigo-200 ${isMinimized ? 'hidden' : 'block'}`}>Online</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-white/80 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <i className={`fas ${isMinimized ? 'fa-expand' : 'fa-minus'} text-sm`}></i>
        </button>
      </div>

      {/* Messages Container */}
      {!isMinimized && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-robot text-indigo-600 text-sm"></i>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2 ${
                  message.isUser 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.isUser ? 'text-indigo-200' : 'text-gray-400'
                  }`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i className="fas fa-robot text-indigo-600 text-sm"></i>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      {!isMinimized && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                input.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;