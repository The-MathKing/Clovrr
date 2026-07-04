import Head from 'next/head';

export const metadata = {
  title: "Privacy Policy | Clovrr Solutions",
  description: "Privacy Policy and terms of data handling for Aryan Padarthi Clovrr Solutions.",
};

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-extrabold text-white mb-8 pb-4 border-b border-gray-800">Privacy Policy</h1>
          
          <div className="prose prose-emerald prose-invert max-w-none text-gray-300 space-y-8">
            <p className="text-sm text-gray-500 font-medium">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to Aryan Padarthi Clovrr Solutions ("Clovrr," "we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-900/50">
              <h2 className="text-xl font-bold text-emerald-400 mb-3">2. SMS & Communications Data (Twilio A2P 10DLC Compliance)</h2>
              <p className="font-medium text-emerald-100">
                Aryan Padarthi Clovrr Solutions will not share, sell, rent, or trade your personal information or mobile phone numbers to third parties for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties under any circumstances.
              </p>
            </section>

            <section className="bg-gray-950 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-3">3. AI Data Guardrails</h2>
              <p className="font-medium text-gray-200">
                Data submitted through the Clovrr chat widget, SMS, or any integrated forms is used strictly for routing and booking purposes. <strong>It is not used to train global LLM models.</strong> We ensure this by utilizing enterprise-grade API endpoints (such as Google Gemini and OpenAI) which default to zero data retention for model training.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Information We Collect</h2>
              <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                <li><strong className="text-gray-200">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong className="text-gray-200">Contact Data</strong> includes billing address, email address, and telephone numbers.</li>
                <li><strong className="text-gray-200">Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at Clovrr Solutions.
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
