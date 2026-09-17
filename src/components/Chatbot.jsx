import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { API_BASE_URL } from '../config';
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
      text: "Hi! I'm Lana, Harish's AI assistant. Ask me anything about his projects, skills, or background!",
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

    try {
      const endpoints = [
        `${API_BASE_URL}/api/v1/chat/send`,
        '/api/v1/chat/send',
        `${API_BASE_URL}/v1/chat/send`,
        `${API_BASE_URL}/api/chat/send`
      ];

      let response;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text }),
          });
          if (res.ok) {
            response = res;
            break;
          }
          response = res;
        } catch (err) {
          // Network error, try next candidate
        }
      }

      if (!response) {
        throw new Error('Network failure: Unable to reach assistant server.');
      }

      let botResponseText = '';
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        botResponseText = 'Sorry, unable to process request right now. Please try again.';
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (typeof data === 'string') {
            botResponseText = data;
          } else if (data && typeof data === 'object') {
            botResponseText = data.message || data.response || data.reply || data.answer || data.content || data.result || JSON.stringify(data);
          }
        } else {
          botResponseText = await response.text();
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText || 'No response received. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Chat backend error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I am currently unable to process your request. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
        aria-label="Toggle Lana AI Assistant Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-panel glass-card">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <div>
                <h4 className="assistant-title">Lana</h4>
                <span className="status-text">AI Assistant</span>
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
            Lana AI Assistant
          </div>
        </div>
      )}
    </div>
  );
}
