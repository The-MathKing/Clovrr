/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import Image from 'next/image';
import SimulatorWidget from '@/components/SimulatorWidget';
import ROICalculator from '@/components/ROICalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-900/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-blob"></div>
        <div className="absolute top-1/2 -right-1/4 w-3/4 h-3/4 bg-blue-900/10 rounded-full blur-[120px] opacity-30 mix-blend-screen animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="w-full bg-black/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <svg viewBox="0 0 100 100" className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor">
                <circle cx="50" cy="25" r="18" />
                <circle cx="73.8" cy="42.3" r="18" />
                <circle cx="64.7" cy="70.2" r="18" />
                <circle cx="35.3" cy="70.2" r="18" />
                <circle cx="26.2" cy="42.3" r="18" />
                <circle cx="50" cy="50" r="16" fill="currentColor" />
                <circle cx="50" cy="50" r="6" fill="#000" />
              </svg>
              <span className="font-semibold text-lg tracking-tight text-white">Clovrr</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Log in
              </a>
              <a href="/demo" className="relative group inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg opacity-70 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <div className="relative bg-black border border-white/10 hover:border-white/20 text-white px-4 py-1.5 rounded-lg font-medium transition-all text-sm flex items-center gap-2">
                  Book Demo
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-gray-400">⌘K</kbd>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-32">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium tracking-wide shadow-sm hover:bg-white/10 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Clovrr OS 2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-tight">
            You pay $50 for a click. <br className="hidden md:block"/>
            Don't lose the deal because <br className="hidden md:block"/> you replied 14 hours late.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed tracking-tight">
            Clovrr's AI Lead Concierge responds, qualifies, and books your inbound leads in 30 seconds, 24/7. Stop bleeding ad spend and start closing.
          </p>
          <div className="pt-8">
            <a href="/demo" className="inline-flex items-center justify-center bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-xl font-medium text-base transition-transform transform hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              See the bot in action
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </section>

        {/* PROOF SECTION */}
        <section className="relative w-full flex justify-center">
          <SimulatorWidget />
        </section>

        {/* ROI Calculator Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <ROICalculator />
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-black text-gray-500 py-12 border-t border-white/5 relative z-10 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-70">
            <svg viewBox="0 0 100 100" className="w-5 h-5" fill="currentColor">
              <circle cx="50" cy="50" r="40" />
            </svg>
            <span className="font-medium text-sm text-gray-400 tracking-tight">Clovrr Solutions</span>
          </div>
          <div className="flex gap-6 text-xs font-medium">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms-of-service" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
