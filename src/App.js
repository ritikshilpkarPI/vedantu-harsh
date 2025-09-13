// src/App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useLocation,
  Link
} from 'react-router-dom';
import './App.css';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

// Default Configuration - Vedantu Channel for Harsh Priyam Master Teacher
const DEFAULT_SETTINGS = {
  youtubeChannelId: 'UC91RZv71f8p0VV2gaFI07pg',
  youtubeChannelName: 'Harsh Priyam - Vedantu Master Teacher',
  youtubeSubscribeUrl:
    'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1',
  pdfDownloadUrl: 'https://vdnt.in/short?q=H2a8P'
};

/* -----------------------
   Helper functions
   ----------------------- */

function encodeForRedirect(url) {
  try {
    return encodeURIComponent(btoa(url));
  } catch {
    return encodeURIComponent(url);
  }
}

function tryBase64Decode(q) {
  if (!q) return null;
  try {
    const candidate = decodeURIComponent(q);
    try {
      // try base64 decode
      return atob(candidate);
    } catch {
      // not base64: treat as plain URL
      return candidate;
    }
  } catch (e) {
    return null;
  }
}

function isEmbeddedBrowser() {
  const ua = (navigator.userAgent || '').toLowerCase();
  return (
    ua.includes('wv') ||
    ua.includes('webview') ||
    ua.includes('instagram') ||
    ua.includes('fbav') ||
    ua.includes('fban') ||
    ua.includes('youtube') ||
    ua.includes('twitter') ||
    ua.includes('tiktok') ||
    window.self !== window.top
  );
}

function isAndroid() {
  return /android/i.test(navigator.userAgent || '');
}

function buildIntentUrl(finalUrl) {
  // Chrome intent that often forces opening Chrome on Android.
  // Use S.browser_fallback_url so that if intent fails it falls back to https URL.
  const fallback = encodeURIComponent(finalUrl);
  return `intent://open#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
}

/* -----------------------
   RedirectLauncherInner (in-file)
   Route: /r?u=<encoded-url>
   ----------------------- */
function RedirectLauncherInner() {
  const loc = useLocation();
  const [finalUrl, setFinalUrl] = useState(null);
  const [triedAuto, setTriedAuto] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    const u = params.get('u');
    const decoded = tryBase64Decode(u);
    setFinalUrl(decoded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search]);

  useEffect(() => {
    if (!finalUrl) return;

    const embedded = isEmbeddedBrowser();

    // If embedded and Android, attempt intent:// which often opens Chrome.
    if (embedded && isAndroid()) {
      try {
        // Try automatic intent redirect first
        window.location.href = buildIntentUrl(finalUrl);
      } catch (e) {
        // ignore - fallback UI will appear
      } finally {
        setTriedAuto(true);
      }
      return;
    }

    // If not embedded: open in new tab automatically.
    if (!embedded) {
      try {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        try {
          window.location.href = finalUrl;
        } catch {}
      } finally {
        setTriedAuto(true);
      }
      return;
    }

    // Embedded but not Android (likely iOS): do not auto-redirect — show manual UI
    setTriedAuto(true);
  }, [finalUrl]);

  if (!finalUrl) {
    return (
      <div style={{ padding: 30, fontFamily: 'Arial, sans-serif' }}>
        <h2>Invalid or missing destination</h2>
        <p>
          No destination URL provided. Make sure the <code>u</code> query param is present.
        </p>
      </div>
    );
  }

  // Build an intent:// URL string (for Android manual tap)
  const intentHref = buildIntentUrl(finalUrl);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
        background: '#f6fbff'
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: '100%',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          background: 'white',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Open in Browser</h2>

        <p style={{ color: '#444' }}>
          {isEmbeddedBrowser()
            ? 'This link opened inside an app. Use one of the options below to open the destination in your browser.'
            : 'If a new tab did not open, use these options to open the destination.'}
        </p>

        <div style={{ margin: '16px 0', display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              try {
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
              } catch {
                try {
                  window.location.href = finalUrl;
                } catch {}
              }
            }}
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              background: '#205781',
              color: 'white',
              boxShadow: '0 6px 18px rgba(32,87,129,0.18)'
            }}
          >
            Open in Browser
          </button>

          {/* Visible intent:// anchor — user can tap this if automatic redirect failed.
              Some in-app browsers will honor a user-tapped intent link even if JS redirects are blocked. */}
          <a
            href={intentHref}
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 16,
              border: '1px solid #ddd',
              color: '#205781'
            }}
            onClick={() => {
              /* allow native handler */
            }}
          >
            Open (Android intent)
          </a>
        </div>

        <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
          <p style={{ marginBottom: 6 }}>Or copy this URL and open it in Chrome / Safari:</p>

          <div
            style={{
              background: '#fafafa',
              padding: '10px',
              borderRadius: 6,
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              fontSize: 12
            }}
          >
            {finalUrl}
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(finalUrl).then(
                    () => alert('URL copied to clipboard'),
                    () => alert('Copy failed — long-press the URL and copy manually')
                  );
                } else {
                  alert('Clipboard API not available — long-press and copy the URL manually');
                }
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              Copy URL
            </button>
          </div>
        </div>

        {triedAuto && (
          <p style={{ color: '#888', fontSize: 12, marginTop: 12 }}>
            If nothing happens automatically, tap “Open (Android intent)” (Android) or use the Open in Browser /
            Copy URL options (iOS).
          </p>
        )}
      </div>
    </div>
  );
}

/* -----------------------
   AdminRoute component (unchanged)
   ----------------------- */
function AdminRoute() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');

    if (adminSession && sessionExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(sessionExpiry, 10);

      if (now < expiry) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAdminLogin = (success) => {
    if (success) {
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminSessionExpiry', expiry.toString());
      setIsAdminLoggedIn(true);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    setIsAdminLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}
      >
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

/* -----------------------
   MainApp (unchanged UI except minor)
   ----------------------- */
function MainApp() {
  return (
    <div className="App">
      <div className="hero">
        <div className="container">
          <h1>YouTube Subscription Gate</h1>
          <p>Access exclusive educational content through generated links</p>
        </div>
      </div>

      <div className="container">
        <div className="simple-layout">
          <div className="main-card">
            <div className="card-header">
              <h2>🔒 Access Required</h2>
              <p>This page requires a valid access link to view content</p>
            </div>

            <div className="disabled-notice">
              <div className="notice-icon">🚫</div>
              <h3>Direct Access Not Allowed</h3>
              <p>
                To access the subscription and download features, you need a valid link generated by an
                administrator.
              </p>
            </div>

            <div className="two-button-layout">
              <button className="btn btn-subscribe" disabled title="Requires valid access link">
                📺 Subscribe to Channel
              </button>

              <button className="btn btn-download" disabled title="Requires valid access link">
                📄 Download PDF
              </button>
            </div>

            <div className="instructions">
              <p>
                <strong>How to get access:</strong>
              </p>
              <ol>
                <li>Contact the administrator for a valid access link</li>
                <li>Use the provided link to access the subscription page</li>
                <li>Follow the instructions on that page to download your PDF</li>
              </ol>
              <p className="contact-note">
                <strong>Note:</strong> Each access link is unique and provides access to specific content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -----------------------
   ConfigurableApp - modified to use redirect route instead of direct external navigation
   ----------------------- */
function ConfigurableApp() {
  const { configId } = useParams();
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // decodeConfigFromUrl (kept from your original code)
    try {
      if (!configId || configId.length < 20) {
        // fallback to defaults if configId not present or too short
        setSettings(DEFAULT_SETTINGS);
        setIsLoading(false);
        return;
      }
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
      setSettings(DEFAULT_SETTINGS);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configId]);

  const handleDownloadPDF = () => {
    // Temporarily enabled - no subscription check
    // if (!hasSubscribed) {
    //   setMessage('Please subscribe to the channel first to download the PDF.');
    //   return;
    // }

    // open our redirect route so the user can get to a real browser
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
    // quick detection for embedded environment to suggest manual open
    const ua = navigator.userAgent.toLowerCase();
    const embedded =
      ua.includes('youtube') || ua.includes('wv') || ua.includes('webview') || window.self !== window.top;
    if (embedded || message.includes('Redirecting')) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              backdropFilter: 'blur(10px)',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Opening in Browser</h2>
            <p style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', opacity: 0.9 }}>
              For the best experience, we're redirecting you to your browser
            </p>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>
              <p>If the redirect doesn't work:</p>
              <p
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  wordBreak: 'break-all',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}
              >
                {window.location.href}
              </p>
              <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Copy this URL and open it in Chrome or Safari</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}
      >
        Loading configuration...
      </div>
    );
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
              <p>
                Subscribe to {settings.youtubeChannelName}'s YouTube channel and download exclusive study
                material
              </p>
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
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="loading" /> Opening PDF...
                  </>
                ) : (
                  '📄 Download PDF'
                )}
              </button>
            </div>

            {message && <div className={`message ${hasSubscribed ? 'success' : 'info'}`}>{message}</div>}

            <div className="instructions">
              <p>
                <strong>How it works:</strong>
              </p>
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

/* -----------------------
   App root with routes
   ----------------------- */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/c/:configId" element={<ConfigurableApp />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/r" element={<RedirectLauncherInner />} />
        <Route
          path="*"
          element={
            <div style={{ padding: 30 }}>
              <h2>Page not found</h2>
              <p>
                Go back to <Link to="/">home</Link>.
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
