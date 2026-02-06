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
    <div className="min-h-screen bg-sand-dune flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-cyprus/5 rounded-2xl blur-xl transform rotate-1"></div>

          <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-cyprus/10 p-8">

            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-cyprus rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock size={32} className="text-sand-dune" />
              </div>
              <h1 className="text-3xl font-bold text-cyprus mb-2">Admin Login</h1>
              <p className="text-cyprus/70">Enter your admin password to view feedback</p>
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
                  className="w-full px-4 py-3 bg-white border border-cyprus/20 rounded-lg text-cyprus placeholder-cyprus/40 focus:outline-none focus:ring-2 focus:ring-cyprus focus:border-transparent transition-all"
                  autoFocus
                />
              </div>


              <button
                type="submit"
                disabled={!password || isLoading}
                className="w-full bg-cyprus text-sand-dune font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Verifying...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 p-3 bg-cyprus/5 border border-cyprus/10 rounded-lg">
              <p className="text-cyprus/60 text-xs text-center">
                Reachout Team
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
