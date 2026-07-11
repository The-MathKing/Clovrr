"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';

export default function SalesPlayground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-emerald-900/10 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-900/10 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
      </div>

      {/* Nav */}
      <nav className="w-full bg-black/50 backdrop-blur-xl border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-6 h-6 text-white" fill="currentColor">
                <circle cx="50" cy="25" r="18" />
                <circle cx="73.8" cy="42.3" r="18" />
                <circle cx="64.7" cy="70.2" r="18" />
                <circle cx="35.3" cy="70.2" r="18" />
                <circle cx="26.2" cy="42.3" r="18" />
                <circle cx="50" cy="50" r="16" fill="currentColor" />
                <circle cx="50" cy="50" r="6" fill="#000" />
              </svg>
              <span className="font-semibold text-lg tracking-tight text-white">Clovrr</span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">DEMO ENVIRONMENT</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <SplitText text="Omnichannel AI Concierge" />
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This is a live simulation of the Clovrr Omni-Engine. See how the AI instantly responds to leads across every major communication channel.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* MOCKUP 1: SMS / WhatsApp */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden flex flex-col relative group"
          >
            <div className="p-4 border-b border-white/5 bg-[#111] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">📱</div>
              <div>
                <h3 className="text-white font-medium text-sm">SMS & WhatsApp</h3>
                <p className="text-[10px] text-gray-500">Powered by Twilio</p>
              </div>
            </div>
            <div className="flex-1 p-4 bg-black flex flex-col gap-3 min-h-[300px]">
              <div className="self-end bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-sm text-xs max-w-[85%] shadow-sm">
                Hey, do you guys do emergency leak repairs?
              </div>
              <div className="self-start bg-[#1a1a1a] text-gray-200 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-xs max-w-[85%] shadow-sm mt-2 relative">
                <span className="text-emerald-400 font-semibold text-[10px] block mb-1">AI Agent</span>
                Yes we do! We have a tech available in your area within the hour. Would you like me to book them for you?
              </div>
              <div className="self-end bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-sm text-xs max-w-[85%] shadow-sm mt-2">
                Yes please.
              </div>
              <div className="self-start bg-[#1a1a1a] text-gray-200 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-xs max-w-[85%] shadow-sm mt-2 relative">
                <span className="text-emerald-400 font-semibold text-[10px] block mb-1">AI Agent</span>
                Great, you can confirm your dispatch right here: <span className="text-blue-400 underline">clovrr.com/book</span>
              </div>
            </div>
            {/* Glowing Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>

          {/* MOCKUP 2: Web Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden flex flex-col relative group"
          >
            <div className="p-4 border-b border-white/5 bg-[#111] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">🌐</div>
              <div>
                <h3 className="text-white font-medium text-sm">Website Live Chat</h3>
                <p className="text-[10px] text-gray-500">Embeddable Widget</p>
              </div>
            </div>
            <div className="flex-1 bg-white relative min-h-[300px]">
              {/* Fake website background */}
              <div className="p-4 opacity-20">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-24 bg-gray-300 rounded w-full"></div>
              </div>
              {/* Fake Widget UI */}
              <div className="absolute bottom-4 right-4 w-[90%] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
                <div className="bg-emerald-500 text-white text-xs font-semibold p-2">Chat with us</div>
                <div className="p-3 bg-gray-50 flex flex-col gap-2 h-32 overflow-hidden">
                  <div className="bg-gray-200 text-gray-800 p-2 rounded-lg rounded-tl-sm text-[10px] self-start max-w-[90%]">
                    Hi! I'm the AI assistant. What are you looking for today?
                  </div>
                  <div className="bg-emerald-500 text-white p-2 rounded-lg rounded-tr-sm text-[10px] self-end max-w-[90%]">
                    Pricing for a new roof.
                  </div>
                  <div className="bg-gray-200 text-gray-800 p-2 rounded-lg rounded-tl-sm text-[10px] self-start max-w-[90%] flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100 flex gap-2">
                  <div className="flex-1 h-6 bg-gray-100 rounded-full"></div>
                  <div className="w-6 h-6 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>

          {/* MOCKUP 3: Meta / Google */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden flex flex-col relative group"
          >
            <div className="p-4 border-b border-white/5 bg-[#111] flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white text-xs border-2 border-[#111]">📸</div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 text-xs border-2 border-[#111]">G</div>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Social & Search</h3>
                <p className="text-[10px] text-gray-500">Instagram / Google Maps</p>
              </div>
            </div>
            <div className="flex-1 bg-black p-4 flex flex-col items-center justify-center min-h-[300px] relative">
              
              <div className="w-full bg-[#1a1a1a] rounded-xl border border-white/10 p-3 mb-4 relative z-10 shadow-lg translate-x-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500"></div>
                  <span className="text-[10px] text-gray-400 font-medium">Instagram DM</span>
                </div>
                <p className="text-white text-xs">Do you guys service the downtown area?</p>
                <div className="mt-2 bg-black border border-white/5 rounded-lg p-2 text-[10px] text-gray-300">
                  <span className="text-purple-400 font-semibold block mb-0.5">AI Reply (Instant)</span>
                  Yes, we service all of downtown! Can I schedule a free estimate for you?
                </div>
              </div>

              <div className="w-full bg-[#1a1a1a] rounded-xl border border-white/10 p-3 relative z-10 shadow-lg -translate-x-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold text-blue-500 text-[10px]">G</div>
                  <span className="text-[10px] text-gray-400 font-medium">Google Maps Chat</span>
                </div>
                <p className="text-white text-xs">What are your hours today?</p>
                <div className="mt-2 bg-black border border-white/5 rounded-lg p-2 text-[10px] text-gray-300">
                  <span className="text-blue-400 font-semibold block mb-0.5">AI Reply (Instant)</span>
                  We are open until 6:00 PM today.
                </div>
              </div>

            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
          </motion.div>

          {/* MOCKUP 4: Voice AI */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden flex flex-col relative group"
          >
            <div className="p-4 border-b border-white/5 bg-[#111] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg">🎙️</div>
              <div>
                <h3 className="text-white font-medium text-sm">Inbound Voice</h3>
                <p className="text-[10px] text-gray-500">Live phone calls</p>
              </div>
            </div>
            <div className="flex-1 bg-black p-4 flex flex-col items-center justify-center gap-6 min-h-[300px]">
              <div className="text-center">
                <div className="text-white font-medium text-sm mb-1">Incoming Call...</div>
                <div className="text-emerald-400 text-[10px]">AI Receptionist Active</div>
              </div>

              {/* Fake Audio Visualizer */}
              <div className="flex items-center gap-1 h-12">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-emerald-500 rounded-full"
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/50">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/50">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
