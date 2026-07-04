"use client";
import React, { useState } from 'react';
import { InlineWidget } from "react-calendly";

export default function DemoPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <nav className="w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-emerald-500" fill="currentColor">
                <circle cx="50" cy="25" r="18" />
                <circle cx="73.8" cy="42.3" r="18" />
                <circle cx="64.7" cy="70.2" r="18" />
                <circle cx="35.3" cy="70.2" r="18" />
                <circle cx="26.2" cy="42.3" r="18" />
                <circle cx="50" cy="50" r="16" fill="currentColor" />
                <circle cx="50" cy="50" r="6" fill="#022c22" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-white">Clovrr</span>
            </a>
            <a href="/" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col md:flex-row min-h-[650px]">
          
          {/* Left Column - Details Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-900 text-white flex flex-col justify-center relative border-r border-gray-800">
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">Claim your advantage.</h2>
            <p className="text-gray-400 mb-8">Enter your details to access our live calendar and book your custom integration demo.</p>
            
            {isUnlocked ? (
               <div className="bg-emerald-900/30 border border-emerald-500/30 p-6 rounded-xl flex flex-col items-center text-center">
                 <svg className="w-16 h-16 text-emerald-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h3 className="text-xl font-bold text-white mb-2">Access Granted</h3>
                 <p className="text-emerald-200 text-sm">Please select a time on the calendar to your right to finalize your booking.</p>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                  <input type="text" id="name" className="mt-1 block w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="John Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">Work Email</label>
                  <input type="email" id="email" className="mt-1 block w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="john@agency.com" required />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-400">Company / Agency Name</label>
                  <input type="text" id="company" className="mt-1 block w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Acme Media" required />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-900/50">
                    Continue to Calendar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column - Calendly Component */}
          <div className="w-full md:w-1/2 bg-gray-950 flex flex-col relative h-[650px]">
            {!isUnlocked && (
              <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center">
                 <svg className="w-12 h-12 text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
                 <h3 className="text-xl font-bold text-white mb-2">Calendar Locked</h3>
                 <p className="text-gray-400 text-sm font-medium">Please fill out your details on the left to securely load the booking calendar.</p>
              </div>
            )}
            
            <div className={`w-full h-full transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-10'}`}>
              <InlineWidget 
                url="https://calendly.com/luna-adhra" 
                styles={{ height: '100%', width: '100%' }}
                pageSettings={{
                  backgroundColor: '0a0a0a',
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
