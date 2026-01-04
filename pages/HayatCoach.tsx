import React, { useState, useRef, useEffect } from 'react';
import { getHealthCoaching } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, Sparkles } from 'lucide-react';

const HayatCoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Marhaba! I am Hayat. How are you feeling today? I can help you find indoor routes, connect with your Moai group, or give nutrition advice based on Blue Zones science.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getHealthCoaching(userMsg.text, history);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-hayat-night flex items-center">
          <Bot className="mr-2 text-hayat-teal" /> Hayat Coach
        </h1>
        <p className="text-sm text-hayat-slate">Your AI longevity guide.</p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-hayat-teal text-white rounded-br-sm'
                  : 'bg-white text-hayat-night border border-slate-100 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-100 flex items-center space-x-2">
                <Sparkles size={16} className="text-hayat-gold animate-pulse" />
                <span className="text-xs text-hayat-slate">Hayat is thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about diet, walks, or sleep..."
          className="w-full bg-white border border-slate-200 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-hayat-teal focus:ring-1 focus:ring-hayat-teal shadow-sm text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-2 top-2 p-1.5 bg-hayat-teal text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default HayatCoach;