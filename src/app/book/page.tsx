"use client";
import React, { useState } from 'react';
import { InlineWidget } from "react-calendly";
import Link from 'next/link';

export default function DemoPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-900/10 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
      </div>

      <nav className="w-full bg-black/50 backdrop-blur-xl border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Client Login
              </Link>
              <Link href="/" className="text-gray-500 hover:text-white font-medium text-sm transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl w-full bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row min-h-[650px] relative">
          
          {/* Left Column - Details Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#0a0a0a] text-white flex flex-col justify-center relative border-r border-white/5">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-emerald-400">Claim your advantage.</h2>
            <p className="text-gray-400 mb-8 text-sm">Enter your details to access our live calendar and book your custom integration demo.</p>
            
            {isUnlocked ? (
               <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-xl flex flex-col items-center text-center">
                 <svg className="w-12 h-12 text-emerald-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h3 className="text-lg font-semibold text-white mb-2">Access Granted</h3>
                 <p className="text-emerald-200/70 text-sm">Please select a time on the calendar to your right to finalize your booking.</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                  <input type="text" id="name" className="block w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1">Work Email</label>
                  <input type="email" id="email" className="block w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm" placeholder="john@agency.com" required />
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs font-medium text-gray-400 mb-1">Company / Agency Name</label>
                  <input type="text" id="company" className="block w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm" placeholder="Acme Media" required />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-900/20 text-sm">
                    Continue to Calendar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column - Calendly Component */}
          <div className="w-full md:w-1/2 bg-black flex flex-col relative h-[650px]">
            {!isUnlocked && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
                 <svg className="w-10 h-10 text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                 <h3 className="text-lg font-semibold text-white mb-2">Calendar Locked</h3>
                 <p className="text-gray-500 text-sm font-medium max-w-xs">Please fill out your details on the left to securely load the booking calendar.</p>
              </div>
            )}
            
            <div className={`w-full h-full transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-10'}`}>
              <InlineWidget 
                url="https://calendly.com/luna-adhra" 
                styles={{ height: '100%', width: '100%' }}
                pageSettings={{
                  backgroundColor: '000000',
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: '10b981',
                  textColor: 'ffffff'
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
