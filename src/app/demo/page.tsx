import React from 'react';

export const metadata = {
  title: "Book Demo | Clovrr Solutions",
  description: "Book your custom Clovrr AI Lead Concierge demo.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-emerald-700" fill="currentColor">
                <path d="M50 5 C50 5 62 25 78 30 C95 36 90 58 90 58 C90 58 75 68 65 85 C55 100 45 100 35 85 C25 68 10 58 10 58 C10 58 5 36 22 30 C38 25 50 5 50 5 Z" />
                <circle cx="50" cy="50" r="12" fill="white" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-emerald-900">Clovrr</span>
            </a>
            <a href="/" className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column - Details Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-900 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">Claim your advantage.</h2>
            <p className="text-gray-300 mb-8">Enter your details to access our live calendar and book your custom integration demo.</p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                <input type="text" id="name" className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="John Doe" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Work Email</label>
                <input type="email" id="email" className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="john@agency.com" required />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-400">Company / Agency Name</label>
                <input type="text" id="company" className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Acme Media" required />
              </div>
              <div className="pt-4">
                <button type="button" onClick={() => alert('In production, this would validate and reveal the calendar!')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-900/50">
                  Continue to Calendar
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Calendly (Mockup) */}
          <div className="w-full md:w-1/2 bg-gray-50 p-8 md:p-12 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
               <svg className="w-12 h-12 text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" /></svg>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Calendar Locked</h3>
               <p className="text-gray-500 text-sm">Please fill out your details on the left to load the booking calendar.</p>
            </div>
            
            {/* The actual calendly embed container (blurred out initially) */}
            <div className="w-full h-full min-h-[400px] border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center p-4 text-center opacity-40">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Calendly Embed</h3>
              <p className="text-gray-500 text-xs">Widget will load here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
