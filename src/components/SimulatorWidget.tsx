'use client';

import React, { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const CAMPAIGNS = [
  { label: 'Roofing Reactivation', text: "Hey John, this is Sarah from Clovrr Roofing. We spoke a few months ago about your roof. Are you still looking to get a quote?" },
  { label: 'Plumbing Follow-up', text: "Hi Mike, Sarah here with Clovrr Plumbing. You requested a commercial quote back in Jan, are you still looking to get that done?" },
  { label: 'Auto Insurance Revival', text: "Hey Sarah! Sarah with Clovrr Insurance here. I was reviewing your old file and we can probably lower your auto rate. Want me to run some numbers?" }
];

export default function SimulatorWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Timer logic for API latency
  useEffect(() => {
    if (isTyping) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => (prev === null ? 0 : prev + 0.1));
      }, 100);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTyping]);

  const startCampaign = (initialText: string) => {
    setMessages([{ id: Date.now().toString(), role: 'assistant', content: initialText }]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return; 
    
    const newMessages: Message[] = [...messages, { id: Date.now().toString(), role: 'user', content: text }];
    setMessages(newMessages);
    setIsTyping(true);
    setTimer(0);
    setCustomInput('');

    try {
      const res = await fetch('/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server responded with a status error');
      }

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev, 
        { id: Date.now().toString(), role: 'assistant', content: data.text }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev, 
        { id: Date.now().toString(), role: 'assistant', content: `Oops! API Error: ${err.message}` }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetSimulator = () => {
    setMessages([]);
    setIsTyping(false);
    setTimer(null);
    setCustomInput('');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[650px]">
      
      {/* Top Phone Bar */}
      <div className="h-14 w-full bg-black/80 backdrop-blur-md absolute top-0 left-0 z-10 flex justify-center items-start pt-3 border-b border-white/5">
        <div className="w-24 h-6 bg-[#1a1a1a] rounded-full border border-white/5"></div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-20 pb-36 px-4 space-y-4 scroll-smooth">
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-6 animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h3 className="text-white font-medium">Test Lead Reactivation</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Select a campaign below to simulate the AI reaching out to an old lead.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-[#1a1a1a] text-gray-200 border border-white/5 rounded-bl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex w-full justify-start animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 w-full bg-black/90 backdrop-blur-md pt-4 pb-6 px-4 border-t border-white/10">
        
        {/* Timer UI */}
        {(timer !== null) && (
          <div className="flex justify-center mb-3">
             <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${!isTyping ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>API Response: {timer?.toFixed(1)}s</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        {messages.length === 0 ? (
          <div className="space-y-3 flex flex-col items-center">
            {CAMPAIGNS.map((campaign, i) => (
              <button 
                key={i}
                onClick={() => startCampaign(campaign.text)}
                className="w-full text-left px-4 py-3 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-gray-300 transition-colors flex justify-between items-center group"
              >
                <span>{campaign.label}</span>
                <svg className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(customInput); }} 
              className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-2 py-1 focus-within:border-emerald-500/50 transition-colors"
            >
              <input 
                type="text" 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-transparent border-none text-sm text-white px-3 py-2 focus:outline-none focus:ring-0 placeholder-gray-600"
              />
              <button 
                type="submit"
                disabled={!customInput.trim()}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-gray-600 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
            <div className="flex justify-center mt-2">
              <button 
                onClick={resetSimulator}
                className="text-sm text-gray-500 hover:text-white underline underline-offset-4 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
