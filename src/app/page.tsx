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
              <img src="/icon.png" alt="Clovrr Logo" className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-emerald-900">Clovrr</span>
            </div>
            <a href="#demo" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
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
            <a href="#demo" className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-xl">
              See the bot in action
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </section>

        {/* PROOF SECTION */}
        <section className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          
          <div className="relative">
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
                <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor" className="text-emerald-500"><rect width="100" height="100" rx="20"/><circle cx="50" cy="50" r="15"/><circle cx="35" cy="35" r="15"/><circle cx="65" cy="35" r="15"/><circle cx="35" cy="65" r="15"/><circle cx="65" cy="65" r="15"/><circle cx="50" cy="20" r="15"/></svg>
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
        <section id="demo" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Book your custom demo</h2>
            <p className="text-gray-600">See exactly how Clovrr will plug into your agency's funnel.</p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden min-h-[600px] flex items-center justify-center p-4">
             {/* Calendly Embed Placeholder */}
             <div className="w-full max-w-3xl h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Calendly Embed Goes Here</h3>
                <p className="text-gray-500 mb-6">Replace this container with your Calendly inline embed widget code.</p>
                <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-mono text-sm border border-gray-200 text-left w-full overflow-x-auto">
                  {`<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_LINK" style="min-width:320px;height:600px;"></div>`}
                </div>
             </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="Clovrr Logo" className="h-6 w-6 opacity-75 grayscale" />
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
