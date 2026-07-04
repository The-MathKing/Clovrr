import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-emerald-700" fill="currentColor">
                <path d="M50 5 C50 5 62 25 78 30 C95 36 90 58 90 58 C90 58 75 68 65 85 C55 100 45 100 35 85 C25 68 10 58 10 58 C10 58 5 36 22 30 C38 25 50 5 50 5 Z" />
                <circle cx="50" cy="50" r="12" fill="white" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-emerald-900">Clovrr</span>
            </div>
            <a href="/demo" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
              Book Demo
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide border border-emerald-200 shadow-sm">
            The AI Lead Concierge for B2B Agencies
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            You pay <span className="text-emerald-600">$50</span> for a click. <br className="hidden md:block"/>
            Don't lose the deal because you replied <span className="underline decoration-red-500 decoration-4">14 hours late</span>.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Clovrr's AI Lead Concierge responds, qualifies, and books your inbound leads in 30 seconds, 24/7. Stop bleeding ad spend and start closing.
          </p>
          <div className="pt-4">
            <a href="/demo" className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-xl">
              See the bot in action
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </section>

        {/* PROOF SECTION */}
        <section className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center mb-8">Watch it qualify and book a lead instantly</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center">
              {/* Loom Video Embed Placeholder - REPLACE WITH ACTUAL LOOM EMBED IF PROVIDED */}
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-900 rounded-xl relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80')] opacity-20 bg-cover bg-center"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <svg className="w-16 h-16 text-emerald-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <p className="font-semibold text-lg text-white">Silent Looping Loom Video Embed</p>
                  <p className="text-sm mt-2 text-gray-300">(Bot answering lead & booking Calendly)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MATH SECTION (ROI CALCULATOR) */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The math is terrifying.</h2>
            <p className="text-gray-600">Speed to lead is the only metric that matters.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-400"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Without Clovrr (14hr response)</h3>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="flex justify-between border-b pb-2"><span>Leads Generated</span> <span>100</span></li>
                <li className="flex justify-between border-b pb-2 text-red-600"><span>Close Rate</span> <span>10%</span></li>
                <li className="flex justify-between border-b pb-2"><span>Clients Closed</span> <span>10</span></li>
                <li className="flex justify-between border-b pb-2"><span>Avg LTV</span> <span>$5,000</span></li>
                <li className="flex justify-between pt-2 text-xl font-bold text-gray-900"><span>Revenue</span> <span>$50,000</span></li>
              </ul>
            </div>
            
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden transform md:scale-105 z-10 border border-emerald-500">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor" className="text-emerald-500">
                  <path d="M50 5 C50 5 62 25 78 30 C95 36 90 58 90 58 C90 58 75 68 65 85 C55 100 45 100 35 85 C25 68 10 58 10 58 C10 58 5 36 22 30 C38 25 50 5 50 5 Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-400 mb-6">With Clovrr (&lt;5 min response)</h3>
              <ul className="space-y-4 text-gray-300 font-medium relative z-10">
                <li className="flex justify-between border-b border-gray-700 pb-2"><span>Leads Generated</span> <span className="text-white">100</span></li>
                <li className="flex justify-between border-b border-gray-700 pb-2 text-emerald-400"><span>Close Rate</span> <span>20%</span></li>
                <li className="flex justify-between border-b border-gray-700 pb-2"><span>Clients Closed</span> <span className="text-white">20</span></li>
                <li className="flex justify-between border-b border-gray-700 pb-2"><span>Avg LTV</span> <span className="text-white">$5,000</span></li>
                <li className="flex justify-between pt-2 text-2xl font-bold text-white"><span>Revenue</span> <span className="text-emerald-400">$100,000</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-emerald-700 bg-emerald-50 inline-block px-6 py-3 rounded-xl border border-emerald-200">
              The bot pays for itself on day 1.
            </p>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="demo" className="bg-emerald-900 rounded-3xl p-8 md:p-16 shadow-2xl mb-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-emerald-500">
              <path d="M50 5 C50 5 62 25 78 30 C95 36 90 58 90 58 C90 58 75 68 65 85 C55 100 45 100 35 85 C25 68 10 58 10 58 C10 58 5 36 22 30 C38 25 50 5 50 5 Z" />
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to stop losing leads?</h2>
            <p className="text-emerald-100 text-lg mb-8">Get full access to our demo calendar to see exactly how Clovrr integrates into your agency's funnel.</p>
            <a href="/demo" className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-emerald-900 px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-xl">
              Enter your details to book
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <svg viewBox="0 0 100 100" className="w-6 h-6 opacity-75 grayscale" fill="currentColor">
              <path d="M50 5 C50 5 62 25 78 30 C95 36 90 58 90 58 C90 58 75 68 65 85 C55 100 45 100 35 85 C25 68 10 58 10 58 C10 58 5 36 22 30 C38 25 50 5 50 5 Z" />
              <circle cx="50" cy="50" r="12" fill="white" />
            </svg>
            <span className="font-semibold text-gray-300">Aryan Padarthi Clovrr Solutions</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Clovrr Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
