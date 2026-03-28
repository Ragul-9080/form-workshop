import { useState, useEffect } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

import { ThankYou } from './components/ThankYou';
import { LoadingPage } from './components/LoadingPage';

type AppView = 'form' | 'admin-login' | 'admin-dashboard' | 'thank-you';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [keyPresses, setKeyPresses] = useState<string[]>([]);

  useEffect(() => {
    // Show loading page on initial mount for 5 seconds
    setShowLoadingPage(true);
    const timer = setTimeout(() => {
      setShowLoadingPage(false);
    }, 5000);

    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      setCurrentView('admin-dashboard');
    }

    return () => clearTimeout(timer);
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

    setShowLoadingPage(true);
    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('admin_session', 'active');
        setCurrentView('admin-dashboard');
        setLoginError(null);
      } else {
        setLoginError('Invalid password. Please try again.');
      }
      setIsLoading(false);
      setShowLoadingPage(false);
    }, 5000);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session');
    setCurrentView('form');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen">
      {currentView === 'form' && (
        <FeedbackForm
          onSuccess={() => setCurrentView('thank-you')}
          onSubmitting={(loading) => setShowLoadingPage(loading)}
        />
      )}
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
      {showLoadingPage && <LoadingPage />}
    </div>
  );
}

export default App;
