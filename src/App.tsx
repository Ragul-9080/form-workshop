import { useState, useEffect } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

type AppView = 'form' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      setCurrentView('admin-dashboard');
    }
  }, []);

  const handleAdminLogin = (password: string) => {
    setIsLoading(true);
    setLoginError(null);

    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('admin_session', 'active');
        setCurrentView('admin-dashboard');
        setLoginError(null);
      } else {
        setLoginError('Invalid password. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session');
    setCurrentView('form');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen">
      {currentView === 'form' && (
        <div>
          <FeedbackForm />
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => setCurrentView('admin-login')}
              className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-slate-600 hover:to-slate-700 transition-all shadow-lg border border-white/10"
            >
              Admin
            </button>
          </div>
        </div>
      )}
      {currentView === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          error={loginError}
          isLoading={isLoading}
        />
      )}
      {currentView === 'admin-dashboard' && (
        <AdminDashboard onLogout={handleAdminLogout} />
      )}
    </div>
  );
}

export default App;
