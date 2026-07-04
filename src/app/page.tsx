import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
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
            </div>
            <div className="flex items-center gap-6">
              <a href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Client Login
              </a>
              <a href="/demo" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm shadow-lg shadow-emerald-900/50">
                Book Demo
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-900/30 text-emerald-400 text-sm font-semibold tracking-wide border border-emerald-800 shadow-sm">
            The AI Lead Concierge for B2B Agencies
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            You pay <span className="text-emerald-500">$50</span> for a click. <br className="hidden md:block"/>
            Don't lose the deal because you replied <span className="underline decoration-red-500 decoration-4">14 hours late</span>.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Clovrr's AI Lead Concierge responds, qualifies, and books your inbound leads in 30 seconds, 24/7. Stop bleeding ad spend and start closing.
          </p>
          <div className="pt-4">
            <a href="/demo" className="inline-flex items-center justify-center bg-white hover:bg-gray-200 text-gray-950 px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-xl">
              See the bot in action
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </section>

        {/* PROOF SECTION */}
        <section className="bg-gray-900 rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">Watch it qualify and book a lead instantly</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-inner flex items-center justify-center">
              {/* Actual Loom Embed Goes Here */}
              <iframe src="https://www.loom.com/embed/placeholder" frameBorder="0" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></iframe>
            </div>
          </div>
        </section>

        {/* MATH SECTION (ROI CALCULATOR) */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">The math is terrifying.</h2>
            <p className="text-gray-400">Speed to lead is the only metric that matters.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-sm border border-red-900/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
              <h3 className="text-xl font-bold text-gray-200 mb-6">Without Clovrr (14hr response)</h3>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li className="flex justify-between border-b border-gray-800 pb-2"><span>Leads Generated</span> <span className="text-gray-300">100</span></li>
                <li className="flex justify-between border-b border-gray-800 pb-2 text-red-400"><span>Close Rate</span> <span>10%</span></li>
                <li className="flex justify-between border-b border-gray-800 pb-2"><span>Clients Closed</span> <span className="text-gray-300">10</span></li>
                <li className="flex justify-between border-b border-gray-800 pb-2"><span>Avg LTV</span> <span className="text-gray-300">$5,000</span></li>
                <li className="flex justify-between pt-2 text-xl font-bold text-white"><span>Revenue</span> <span>$50,000</span></li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-900 to-gray-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden transform md:scale-105 z-10 border border-emerald-500/50">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor" className="text-emerald-500">
                  <circle cx="50" cy="25" r="18" />
                  <circle cx="73.8" cy="42.3" r="18" />
                  <circle cx="64.7" cy="70.2" r="18" />
                  <circle cx="35.3" cy="70.2" r="18" />
                  <circle cx="26.2" cy="42.3" r="18" />
                  <circle cx="50" cy="50" r="16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-400 mb-6">With Clovrr (&lt;5 min response)</h3>
              <ul className="space-y-4 text-gray-300 font-medium relative z-10">
                <li className="flex justify-between border-b border-emerald-800 pb-2"><span>Leads Generated</span> <span className="text-white">100</span></li>
                <li className="flex justify-between border-b border-emerald-800 pb-2 text-emerald-400"><span>Close Rate</span> <span>20%</span></li>
                <li className="flex justify-between border-b border-emerald-800 pb-2"><span>Clients Closed</span> <span className="text-white">20</span></li>
                <li className="flex justify-between border-b border-emerald-800 pb-2"><span>Avg LTV</span> <span className="text-white">$5,000</span></li>
                <li className="flex justify-between pt-2 text-2xl font-bold text-white"><span>Revenue</span> <span className="text-emerald-400">$100,000</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-emerald-400 bg-emerald-900/30 inline-block px-6 py-3 rounded-xl border border-emerald-800">
              The bot pays for itself on day 1.
            </p>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="demo" className="bg-gradient-to-br from-emerald-950 to-gray-900 rounded-3xl p-8 md:p-16 shadow-2xl mb-24 text-center relative overflow-hidden border border-emerald-900/50">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-emerald-500">
              <circle cx="50" cy="25" r="18" />
              <circle cx="73.8" cy="42.3" r="18" />
              <circle cx="64.7" cy="70.2" r="18" />
              <circle cx="35.3" cy="70.2" r="18" />
              <circle cx="26.2" cy="42.3" r="18" />
              <circle cx="50" cy="50" r="16" />
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to stop losing leads?</h2>
            <p className="text-emerald-200 text-lg mb-8">Get full access to our demo calendar to see exactly how Clovrr integrates into your agency's funnel.</p>
            <a href="/demo" className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Enter your details to book
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-500 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-6 h-6 opacity-50" fill="currentColor">
              <circle cx="50" cy="25" r="18" />
              <circle cx="73.8" cy="42.3" r="18" />
              <circle cx="64.7" cy="70.2" r="18" />
              <circle cx="35.3" cy="70.2" r="18" />
              <circle cx="26.2" cy="42.3" r="18" />
              <circle cx="50" cy="50" r="16" />
            </svg>
            <span className="font-semibold text-gray-400">Aryan Padarthi Clovrr Solutions</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Clovrr Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
