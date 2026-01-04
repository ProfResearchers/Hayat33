import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, SectionHeader } from '../components/UIComponents';
import { Send, Bot, Footprints, Flame } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  avatar?: string; // url or null for bot
  text: string;
  isBot: boolean;
  timestamp: string;
}

const Community: React.FC = () => {
  // Mock Data
  const squadGoal = 25000;
  const currentSteps = 18450;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Khalid',
      avatar: 'https://picsum.photos/seed/12/50',
      text: "Just finished my morning rounds at Kite Beach. It's humid!",
      isBot: false,
      timestamp: '08:30 AM'
    },
    {
      id: '2',
      sender: 'Sarah',
      avatar: 'https://picsum.photos/seed/14/50',
      text: "I'm heading to the mall in an hour if anyone wants to join.",
      isBot: false,
      timestamp: '09:15 AM'
    },
    {
      id: '3',
      sender: 'Hayat',
      avatar: undefined,
      text: "Great job squad! You just reduced your collective bio-age by 1 hour based on this morning's activity!",
      isBot: true,
      timestamp: '09:16 AM'
    }
  ]);
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: 'https://picsum.photos/seed/10/50', // Current user
      text: input,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] pb-16">
      <SectionHeader title="Jumeirah Squad" subtitle="Moai active since 2023" />

      {/* THE PACT WIDGET */}
      <GlassCard className="bg-gradient-to-r from-hayat-night to-slate-900 text-white mb-4 !p-4 border-none shadow-lg">
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center space-x-2 text-hayat-gold">
             <Flame size={18} className="animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-widest">The Pact</span>
           </div>
           <span className="text-xs text-slate-400">Resets in 8h</span>
        </div>
        
        <div className="flex justify-between items-end mb-2">
           <span className="text-2xl font-bold">{currentSteps.toLocaleString()}</span>
           <span className="text-sm text-slate-400 mb-1">/ {squadGoal.toLocaleString()} steps</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-hayat-teal to-hayat-green transition-all duration-1000"
             style={{ width: `${(currentSteps / squadGoal) * 100}%` }}
           ></div>
        </div>
        
        <p className="text-[10px] text-slate-400 mt-2 text-right">
           Keep pushing! Only 6k steps to hit the daily goal.
        </p>
      </GlassCard>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 px-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
             
             {/* Avatar (Left) */}
             {!msg.isBot && msg.sender !== 'You' && (
               <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full mr-2 self-end border border-white" />
             )}

             {/* Bot Avatar */}
             {msg.isBot && (
               <div className="w-8 h-8 rounded-full bg-hayat-teal/10 flex items-center justify-center mr-2 self-end">
                  <Bot size={16} className="text-hayat-teal" />
               </div>
             )}

             {/* Message Bubble */}
             <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.isBot 
                  ? 'bg-hayat-teal/5 border border-hayat-teal/20 text-hayat-teal rounded-bl-sm'
                  : msg.sender === 'You'
                    ? 'bg-hayat-night text-white rounded-br-sm'
                    : 'bg-white text-hayat-night border border-slate-100 rounded-bl-sm'
             }`}>
                {msg.isBot && <span className="block text-[10px] font-bold mb-1 uppercase text-hayat-teal">Hayat Moderator</span>}
                {msg.text}
                <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'You' ? 'text-white/50' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
             </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="mt-2 relative">
         <input 
           type="text" 
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           placeholder="Message squad..." 
           className="w-full bg-white border-none shadow-md rounded-full py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-hayat-teal/50 outline-none"
         />
         <button 
           onClick={handleSend}
           disabled={!input.trim()}
           className="absolute right-2 top-2 p-2 bg-hayat-teal text-white rounded-full hover:bg-teal-700 disabled:opacity-50 transition-colors"
         >
           <Send size={18} />
         </button>
      </div>
    </div>
  );
};

export default Community;