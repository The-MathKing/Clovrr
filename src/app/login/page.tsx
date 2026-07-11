import { login, signup, signInWithGoogle } from './actions';
import Link from 'next/link';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-white" fill="currentColor">
            <circle cx="50" cy="25" r="18" />
            <circle cx="73.8" cy="42.3" r="18" />
            <circle cx="64.7" cy="70.2" r="18" />
            <circle cx="35.3" cy="70.2" r="18" />
            <circle cx="26.2" cy="42.3" r="18" />
            <circle cx="50" cy="50" r="16" fill="currentColor" />
            <circle cx="50" cy="50" r="6" fill="#000" />
          </svg>
          <span className="font-semibold text-2xl tracking-tight text-white">Clovrr</span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">Sign in to your dashboard</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or <Link href="/book" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">book a demo to get access</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0a0a0a] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          
          <form className="space-y-6" action={login}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-white/10 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-black text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-white/10 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-black text-white transition-colors"
                />
              </div>
            </div>

            {searchParams?.message && (
              <p className="text-red-400 text-sm text-center bg-red-900/10 p-3 rounded-md border border-red-900/30">
                {searchParams.message}
              </p>
            )}

            <div className="flex gap-4 pt-2">
              <button
                formAction={login}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-black transition-colors"
              >
                Sign in
              </button>
              <button
                formAction={signup}
                className="w-full flex justify-center py-2.5 px-4 border border-white/10 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-[#111] hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-black transition-colors"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0a0a0a] text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <form action={signInWithGoogle}>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-white/10 rounded-md shadow-sm bg-[#111] hover:bg-[#1a1a1a] text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-black transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
