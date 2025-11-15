import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/GeminiChat.css';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are an Educational AI Chatbot designed to help students with their studies and learning. 

IMPORTANT RULES:
1. ONLY answer questions related to education, studies, and learning (e.g., academics, subjects, homework help, study tips, career guidance, educational resources).
2. REFUSE to answer questions that are NOT related to education and studies (e.g., entertainment, politics, gossip, personal opinions on non-educational topics).
3. Be helpful, encouraging, and provide clear explanations.
4. For off-topic questions, politely redirect the user to educational topics.
5. Plain text responses only; do not include any HTML, markdown, or special formatting.

When a user asks an off-topic question, respond with: "I'm an educational chatbot and can only help with study-related questions. Please ask me about your studies, subjects, or educational topics!"

Always maintain a professional and supportive tone.`;

function GeminiChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Educational AI Assistant. I\'m here to help you with your studies, homework, and educational questions. What would you like to learn about today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const genAIRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (API_KEY) {
      try {
        genAIRef.current = new GoogleGenerativeAI(API_KEY);
        const model = genAIRef.current.getGenerativeModel({ model: 'gemini-2.5-flash' });
        chatRef.current = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT }],
            },
            {
              role: 'model',
              parts: [{ text: 'I understand. I will act as an Educational AI Chatbot and only answer education and study-related questions. I\'ll politely decline off-topic questions and redirect users to educational topics.' }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
          },
        });
      } catch (error) {
        console.error('Error initializing Gemini AI:', error);
      }
    } else {
      console.warn('REACT_APP_GEMINI_API_KEY not found in environment variables');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    if (!API_KEY) {
      alert('Gemini API key not configured. Please set REACT_APP_GEMINI_API_KEY environment variable.');
      return;
    }

    if (!chatRef.current) {
      alert('AI chat is not initialized. Please refresh the page and try again.');
      return;
    }

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const result = await chatRef.current.sendMessage(inputValue);
      const assistantMessage = result.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.message) {
        errorMessage += ` (${error.message})`;
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gemini-chat-widget">
      {!showChat ? (
        <button 
          className="chat-toggle-btn"
          onClick={() => setShowChat(true)}
          title="Chat with AI Assistant"
        >
          💬
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h3>ज्ञानी बाबा</h3>
            <button 
              className="chat-close-btn"
              onClick={() => setShowChat(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="chat-input"
            />
            <button 
              type="submit" 
              disabled={loading || !inputValue.trim()}
              className="chat-send-btn"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default GeminiChat;
