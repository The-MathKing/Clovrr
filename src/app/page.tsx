import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SplitText from '@/components/ui/SplitText';
import MagneticButton from '@/components/ui/MagneticButton';
import Link from 'next/link';
import ROICalculator from '@/components/ROICalculator';
import SimulatorWidget from '@/components/SimulatorWidget';

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      <AnimatedBackground />
      
      {/* Premium Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          Clovrr.
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <MagneticButton>
            <a href="https://calendly.com/mihirbr/30min" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform inline-block">
              Book Demo
            </a>
          </MagneticButton>
        </div>
      </nav>

      <main className="pt-40 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        
        {/* HERO SECTION */}
        <section className="min-h-[75vh] flex flex-col justify-center items-start relative z-10">
          <SplitText 
            text="Magnetic commerce for ambitious brands." 
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] max-w-5xl mb-10"
          />
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light mb-14 leading-relaxed">
            Stop leaking ad spend today. Clovrr's AI Lead Concierge responds to every inbound prospect instantly, qualifying them and booking meetings right into your calendar.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <MagneticButton>
              <Link href="/pricing" className="inline-flex h-16 items-center justify-center rounded-full bg-emerald-500 px-10 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                View Pricing
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a href="https://calendly.com/mihirbr/30min" target="_blank" rel="noopener noreferrer" className="inline-flex h-16 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-10 text-base font-medium text-white transition-colors hover:bg-white/10">
                See it in action
              </a>
            </MagneticButton>
          </div>
        </section>

        {/* SIMULATOR & ROI SECTION */}
        <section className="py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Experience<br/><span className="text-emerald-500">the speed.</span></h2>
                <p className="text-gray-400 text-xl font-light max-w-md leading-relaxed">
                  Test out the Clovrr AI Concierge right now. Send a message and watch how quickly it responds, qualifies, and pushes to conversion.
                </p>
              </div>
              <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
                <div className="rounded-[2.4rem] bg-[#050505] p-2">
                   <SimulatorWidget />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Calculate<br/><span className="text-emerald-500">the return.</span></h2>
                <p className="text-gray-400 text-xl font-light max-w-md leading-relaxed">
                  A 5-minute delay drops your lead conversion rate by 80%. See how much revenue you are leaving on the table.
                </p>
              </div>
              <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-emerald-500/30 to-transparent">
                <div className="rounded-[2.4rem] bg-[#050505] p-2">
                   <ROICalculator />
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
