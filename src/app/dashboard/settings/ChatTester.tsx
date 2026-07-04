'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

export default function ChatTester() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/settings/chat-test',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-sm mb-8 relative overflow-hidden flex flex-col h-[500px]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-white">Bot Sandbox</h2>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Testing Mode</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
            <p>Send a message to test your AI Persona.</p>
            <p className="text-xs mt-1 text-gray-600">This does not use Twilio credits.</p>
          </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-sm' 
                : 'bg-white/10 text-gray-200 rounded-tl-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 text-sm animate-pulse">
              typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 relative">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message to your bot..."
          className="w-full bg-black border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 translate-x-px">
            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
