import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

// Default Configuration - Vedantu Channel for Harsh Priyam Master Teacher
const DEFAULT_SETTINGS = {
  youtubeChannelId: 'UC91RZv71f8p0VV2gaFI07pg',
  youtubeChannelName: 'Harsh Priyam - Vedantu Master Teacher',
  youtubeSubscribeUrl: 'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1',
  pdfDownloadUrl: 'https://vdnt.in/short?q=H2a8P'
};

function MainApp() {
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsUpdated, setSettingsUpdated] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        const newSettings = JSON.parse(savedSettings);
        // Check if settings actually changed
        if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
          setSettings(newSettings);
          setSettingsUpdated(true);
          setTimeout(() => setSettingsUpdated(false), 3000);
        }
      }
    };

    // Initial load
    loadSettings();

    // Listen for storage changes (when admin updates settings)
    const handleStorageChange = (e) => {
      if (e.key === 'adminSettings') {
        loadSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes every 5 seconds (for same-tab updates)
    const interval = setInterval(loadSettings, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSubscribeClick = () => {
    // Open YouTube channel for subscription
    window.open(settings.youtubeSubscribeUrl, '_blank');
    
    // Mark as subscribed after user clicks
    setHasSubscribed(true);
    setMessage('Great! Now you can download the PDF.');
  };

  const handleDownloadPDF = () => {
    if (!hasSubscribed) {
      setMessage('Please subscribe to the channel first to download the PDF.');
      return;
    }

    setIsDownloading(true);
    setMessage('Opening PDF download...');
    
    // Open PDF download link
    window.open(settings.pdfDownloadUrl, '_blank');
    
    setTimeout(() => {
      setIsDownloading(false);
      setMessage('PDF download opened in new tab!');
    }, 1000);
  };

  return (
    <div className="App">
      <div className="hero">
        <div className="container">
          <h1>{settings.youtubeChannelName}</h1>
          <p>Subscribe to get exclusive educational content and resources</p>
        </div>
      </div>

      <div className="container">
        <div className="simple-layout">
          <div className="main-card">
            <div className="card-header">
              <h2>📚 Get Your Free PDF Resource</h2>
              <p>Subscribe to {settings.youtubeChannelName}'s YouTube channel and download exclusive study material</p>
            </div>

            <div className="two-button-layout">
              <button 
                className="btn btn-subscribe"
                onClick={handleSubscribeClick}
              >
                📺 Subscribe to Channel
              </button>
              
              <button 
                className="btn btn-download"
                onClick={handleDownloadPDF}
                disabled={!hasSubscribed || isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="loading"></span>
                    Opening PDF...
                  </>
                ) : (
                  '📄 Download PDF'
                )}
              </button>
            </div>

            {message && (
              <div className={`message ${hasSubscribed ? 'success' : 'info'}`}>
                {message}
              </div>
            )}

            {settingsUpdated && (
              <div className="message success">
                ✅ Settings updated by admin!
              </div>
            )}

            <div className="instructions">
              <p><strong>How it works:</strong></p>
              <ol>
                <li>Click "Subscribe to Channel" - it will open YouTube</li>
                <li>Subscribe to {settings.youtubeChannelName}'s channel</li>
                <li>Come back and click "Download PDF"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRoute() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const adminSession = localStorage.getItem('adminSession');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (adminSession && sessionExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(sessionExpiry);
      
      if (now < expiry) {
        // Session is still valid
        setIsAdminLoggedIn(true);
      } else {
        // Session expired, clear it
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleAdminLogin = (success) => {
    if (success) {
      // Set session for 24 hours
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminSessionExpiry', expiry.toString());
      setIsAdminLoggedIn(true);
    }
  };

  const handleAdminLogout = () => {
    // Clear session
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    setIsAdminLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return <AdminPanel onLogout={handleAdminLogout} />;
  } else {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;