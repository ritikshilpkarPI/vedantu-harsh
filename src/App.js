// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import './App.css';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import RedirectLauncher from './RedirectLauncher';

// Default Configuration - Vedantu Channel for Harsh Priyam Master Teacher
const DEFAULT_SETTINGS = {
  youtubeChannelId: 'UC91RZv71f8p0VV2gaFI07pg',
  youtubeChannelName: 'Harsh Priyam - Vedantu Master Teacher',
  youtubeSubscribeUrl: 'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1',
  pdfDownloadUrl: 'https://vdnt.in/short?q=H2a8P'
};

function encodeForRedirect(url) {
  // base64 then encodeURIComponent so it survives as query param
  try {
    return encodeURIComponent(btoa(url));
  } catch {
    // fallback
    return encodeURIComponent(url);
  }
}

// ... (keep your MainApp, AdminRoute the same) ...

function ConfigurableApp() {
  const { configId } = useParams();
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // decodeConfigFromUrl logic unchanged from your original code
    // (copy your existing decodeConfigFromUrl here)
    // For brevity, I'll keep the same logic as your original function:
    try {
      const urlWithoutRandomAndTime = configId.substring(6, configId.length - 8);
      let base64Config = urlWithoutRandomAndTime.replace(/-/g, '+').replace(/_/g, '/');
      while (base64Config.length % 4) base64Config += '=';
      const configString = atob(base64Config);
      const compactConfig = JSON.parse(configString);
      setSettings({
        youtubeChannelId: compactConfig.c,
        youtubeChannelName: compactConfig.n,
        youtubeSubscribeUrl: compactConfig.s,
        pdfDownloadUrl: compactConfig.p
      });
    } catch (error) {
      console.error('Failed to decode configuration:', error);
      setMessage('Invalid or corrupted link. Please check the URL.');
    }
    setIsLoading(false);
  }, [configId]);

  const handleDownloadPDF = () => {
    if (!hasSubscribed) {
      setMessage('Please subscribe to the channel first to download the PDF.');
      return;
    }
    // Instead of directly opening the pdf URL, open our redirect route so the user can get native browser
    const r = `/r?u=${encodeForRedirect(settings.pdfDownloadUrl)}`;
    window.open(r, '_blank', 'noopener,noreferrer');
    setIsDownloading(true);
    setMessage('Attempting to open PDF in browser...');
    setTimeout(() => {
      setIsDownloading(false);
      setMessage('If the PDF did not open automatically, please use the "Open in Browser" button on the new page.');
    }, 1200);
  };

  if (isLoading) {
    return (<div style={{ padding: 40 }}>Loading configuration...</div>);
  }

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
              {/* Use redirect link for subscribe */}
              <a
                href={`/r?u=${encodeForRedirect(settings.youtubeSubscribeUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-subscribe"
                onClick={() => {
                  setHasSubscribed(true);
                  setMessage('YouTube opened — please subscribe and then return to this tab to download the PDF.');
                }}
              >
                📺 Subscribe to Channel
              </a>

              <button
                className="btn btn-download"
                onClick={handleDownloadPDF}
                disabled={!hasSubscribed || isDownloading}
              >
                {isDownloading ? 'Opening PDF...' : '📄 Download PDF'}
              </button>
            </div>

            {message && <div className={`message ${hasSubscribed ? 'success' : 'info'}`}>{message}</div>}

            <div className="instructions">
              <p><strong>How it works:</strong></p>
              <ol>
                <li>Click "Subscribe to Channel" — the redirect will attempt to open YouTube in the browser or app.</li>
                <li>Subscribe and return to this tab.</li>
                <li>Click "Download PDF" — that opens the redirect page which helps open the PDF in your browser.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/c/:configId" element={<ConfigurableApp />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/r" element={<RedirectLauncher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
