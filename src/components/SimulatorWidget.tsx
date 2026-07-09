'use client';

import React, { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const PROMPTS = [
  { label: 'Roofing Quote', text: 'I need a quote for a new roof on my house.' },
  { label: 'Commercial Plumbing', text: 'Do you guys handle commercial plumbing jobs?' },
  { label: 'Auto Insurance', text: 'How much does your full coverage auto insurance cost?' }
];

const RESPONSES: Record<string, string> = {
  'I need a quote for a new roof on my house.': "Hi there! We'd love to help you with your roof. Let's get you a quote. Pick a quick time to chat here: clovrr.com/book",
  'Do you guys handle commercial plumbing jobs?': "Yes we do! Our commercial team is ready to help. Book a quick discovery call here: clovrr.com/book",
  'How much does your full coverage auto insurance cost?': "We offer great auto rates! Let's review your current policy to get an exact number. Grab a slot: clovrr.com/book"
};

export default function SimulatorWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTyping && !hasResponded) {
      interval = setInterval(() => {
        setTimer((prev) => (prev === null ? 0 : prev + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTyping, hasResponded]);

  const handlePromptClick = (text: string) => {
    if (isTyping || hasResponded) return; // Prevent multiple clicks
    
    setMessages([{ id: Date.now().toString(), role: 'user', content: text }]);
    setIsTyping(true);
    setTimer(0);

    // Simulate network delay and AI processing (e.g. 1.2 to 1.8 seconds)
    const delay = Math.floor(Math.random() * 600) + 1200; 

    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { id: Date.now().toString(), role: 'assistant', content: RESPONSES[text] }
      ]);
      setIsTyping(false);
      setHasResponded(true);
    }, delay);
  };

  const resetSimulator = () => {
    setMessages([]);
    setIsTyping(false);
    setTimer(null);
    setHasResponded(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[600px]">
      
      {/* Top Phone Bar */}
      <div className="h-14 w-full bg-black/80 backdrop-blur-md absolute top-0 left-0 z-10 flex justify-center items-start pt-3 border-b border-white/5">
        <div className="w-24 h-6 bg-[#1a1a1a] rounded-full border border-white/5"></div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-20 pb-24 px-4 space-y-4 scroll-smooth">
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-6 animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h3 className="text-white font-medium">Test the AI Concierge</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Select a scenario below to see how fast Clovrr responds to a new lead.</p>
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
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-6 px-4">
        
        {/* Timer UI */}
        {(timer !== null || hasResponded) && (
          <div className="flex justify-center mb-4">
             <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${hasResponded ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Response Time: {timer?.toFixed(1)}s</span>
            </div>
          </div>
        )}

        {/* Prompt Buttons */}
        {!hasResponded && !isTyping ? (
          <div className="flex flex-col gap-2">
            {PROMPTS.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => handlePromptClick(prompt.text)}
                className="w-full text-left px-4 py-3 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-gray-300 transition-colors flex justify-between items-center group"
              >
                <span>{prompt.label}</span>
                <svg className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            ))}
          </div>
        ) : hasResponded ? (
          <div className="flex justify-center">
            <button 
              onClick={resetSimulator}
              className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Reset Simulation
            </button>
          </div>
        ) : null}

      </div>
    </div>
  );
}
