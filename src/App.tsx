import { useState, useEffect } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

type AppView = 'form' | 'admin-login' | 'admin-dashboard';

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
      if (e.key.toLowerCase() === 'a') {
        const newKeyPresses = [...keyPresses, 'a'].slice(-2);
        setKeyPresses(newKeyPresses);
        if (newKeyPresses.length === 2 && newKeyPresses.every(k => k === 'a')) {
          setCurrentView('admin-login');
        }
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
      {currentView === 'form' && <FeedbackForm />}
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
