import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import './Chatbot.css';

const SUGGESTIONS = [
  "What are your core technical skills?",
  "Tell me about the Tick-It project.",
  "Are you open to internships?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm Harish's AI assistant. Ask me anything about his projects, skills, or academic background!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll messages to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Spring Boot RAG response flow
    setTimeout(() => {
      let botResponseText = "";
      const query = text.toLowerCase();

      if (query.includes('skill') || query.includes('techn') || query.includes('language')) {
        botResponseText = "Harish specializes in robust backend architectures. His core skills include Java, Spring Boot, Microservices, Apache Kafka, Redis, Nginx, Docker, SQL, and Python.";
      } else if (query.includes('tick-it') || query.includes('project') || query.includes('tickit')) {
        botResponseText = "Harish's flagship project is 'Tick-It', a Spring Boot microservice ticketing platform handling 10k+ concurrent users, featuring Apache Kafka streams and Redis caches.";
      } else if (query.includes('intern') || query.includes('job') || query.includes('hire') || query.includes('open')) {
        botResponseText = "Yes! Harish is actively open to backend engineering internships, ECE research pathways, and DevOps pipelines. Contact him directly at harishss.2k07@gmail.com.";
      } else {
        botResponseText = "That's a great question! Once I am hooked up to Harish's Spring Boot RAG backend later, I will dynamically retrieve precise answers from his papers, databases, and ECE curriculum.";
      }

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Action Button Trigger */}
      <button 
        className={`chatbot-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-panel glass-card">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <div className="status-dot"></div>
              <div>
                <h4 className="assistant-title">Harish's Assistant</h4>
                <span className="status-text">AI Agent (Offline/Simulated)</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="message-bubble-wrapper">
                  <div className="message-bubble">{msg.text}</div>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-message bot typing">
                <div className="message-avatar">
                  <Bot size={14} />
                </div>
                <div className="message-bubble-wrapper">
                  <div className="message-bubble typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions footer */}
          <div className="chat-suggestions">
            {SUGGESTIONS.map((sug, idx) => (
              <button 
                key={idx} 
                className="suggestion-pill"
                onClick={() => handleSendMessage(sug)}
              >
                <Sparkles size={10} style={{ marginRight: '4px' }} />
                {sug}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about skills, projects, contact..."
              disabled={isTyping}
            />
            <button 
              className="chat-send-btn" 
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
          
          <div className="chat-disclaimer">
            Powered by Spring Boot RAG (Frontend mock)
          </div>
        </div>
      )}
    </div>
  );
}
