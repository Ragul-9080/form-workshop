import { useState, useEffect } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

import { ThankYou } from './components/ThankYou';

type AppView = 'form' | 'admin-login' | 'admin-dashboard' | 'thank-you';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyPresses, setKeyPresses] = useState<string[]>([]);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      setCurrentView('admin-dashboard');
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const newKeyPresses = [...keyPresses, key].slice(-5);
      setKeyPresses(newKeyPresses);
      if (newKeyPresses.length === 5 && newKeyPresses.every(k => k === 'x')) {
        setCurrentView('admin-login');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyPresses]);

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
      {currentView === 'form' && <FeedbackForm onSuccess={() => setCurrentView('thank-you')} />}
      {currentView === 'thank-you' && (
        <ThankYou onBackToHome={() => setCurrentView('form')} />
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
