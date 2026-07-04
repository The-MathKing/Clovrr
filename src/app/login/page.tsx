import { login } from './actions';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-500" fill="currentColor">
            <circle cx="50" cy="25" r="18" />
            <circle cx="73.8" cy="42.3" r="18" />
            <circle cx="64.7" cy="70.2" r="18" />
            <circle cx="35.3" cy="70.2" r="18" />
            <circle cx="26.2" cy="42.3" r="18" />
            <circle cx="50" cy="50" r="16" fill="currentColor" />
            <circle cx="50" cy="50" r="6" fill="#022c22" />
          </svg>
          <span className="font-bold text-3xl tracking-tight text-white">Clovrr</span>
        </a>
        <h2 className="text-center text-3xl font-extrabold text-white">Sign in to your dashboard</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or <a href="/demo" className="font-medium text-emerald-500 hover:text-emerald-400">book a demo to get access</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-800">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-950 text-white"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-950 text-white"
                />
              </div>
            </div>

            {searchParams?.message && (
              <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md border border-red-900">
                {searchParams.message}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
