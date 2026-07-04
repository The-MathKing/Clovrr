import Head from 'next/head';

export const metadata = {
  title: "Terms of Service | Clovrr Solutions",
  description: "Terms of Service for Aryan Padarthi Clovrr Solutions.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <nav className="w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
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
          <div className="flex items-center gap-6">
            <a href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Client Login
            </a>
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-800">
          <h1 className="text-3xl font-extrabold text-white mb-8 pb-4 border-b border-gray-800">Terms of Service</h1>
          
          <div className="prose prose-emerald prose-invert max-w-none text-gray-300 space-y-8">
            <p className="text-sm text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the software, products, and services provided by Aryan Padarthi Clovrr Solutions ("Clovrr," "we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. 
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
              <p>
                Clovrr Solutions provides an AI Lead Concierge service utilizing automated SMS and web technologies to qualify leads and facilitate booking appointments. We grant you a limited, non-exclusive, non-transferable right to access and use the services solely for your internal business operations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. User Responsibilities & Compliance</h2>
              <p>
                You are strictly responsible for all activity that occurs under your account. You agree to use our services in compliance with all applicable local, state, national, and international laws, rules, and regulations, including but not limited to the Telephone Consumer Protection Act (TCPA) and Twilio's Acceptable Use Policy regarding automated messaging. 
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Billing and Payments</h2>
              <p>
                Services are billed according to the tier and agreement negotiated at checkout. All fees are non-refundable unless otherwise explicitly stated in writing. We reserve the right to suspend or terminate access to our services if your account falls into arrears.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer of Warranties and Limitation of Liability</h2>
              <p>
                The services are provided on an "as is" and "as available" basis. Clovrr Solutions makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included. You expressly agree that your use of the services is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Modifications to Terms</h2>
              <p>
                We reserve the right to change or modify these Terms of Service at any time. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-gray-950 text-gray-500 py-8 border-t border-gray-800 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Aryan Padarthi Clovrr Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
