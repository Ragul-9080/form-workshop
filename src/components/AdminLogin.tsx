import { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export function AdminLogin({ onLogin, error, isLoading = false }: AdminLoginProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-blue-200">Enter your admin password to view feedback</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-400/50 rounded-lg p-3">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!password || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Verifying...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200 text-xs text-center">
                Admin password is set to "admin123" for demonstration purposes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
