// src/RedirectLauncher.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function tryBase64Decode(q) {
  if (!q) return null;
  try {
    const candidate = decodeURIComponent(q);
    // if it's base64 (contains padding or base64 chars), decode
    try {
      return atob(candidate);
    } catch {
      // not base64, treat as plain URL
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
  // Use Chrome intent that typically forces opening Chrome on Android
  // S.browser_fallback_url ensures fallback to the https url if intent fails
  const fallback = encodeURIComponent(finalUrl);
  // We use a simple intent wrapper — many resources (Chrome docs) describe this syntax.
  return `intent://open#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
}

export default function RedirectLauncher() {
  const loc = useLocation();
  const [finalUrl, setFinalUrl] = useState(null);
  const [triedAuto, setTriedAuto] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    const u = params.get('u');
    const decoded = tryBase64Decode(u);
    setFinalUrl(decoded);
  }, [loc.search]);

  useEffect(() => {
    if (!finalUrl) return;

    const embedded = isEmbeddedBrowser();

    // If embedded and Android, try intent trick
    if (embedded && isAndroid()) {
      try {
        window.location.href = buildIntentUrl(finalUrl);
      } catch (e) {
        // ignore — we'll show manual UI below
      } finally {
        setTriedAuto(true);
      }
      return;
    }

    // If not embedded, open normally in new tab (desktop or regular browser)
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

    // Embedded but not Android (likely iOS) -> show manual UI (no silent redirect possible)
    setTriedAuto(true);
  }, [finalUrl]);

  if (!finalUrl) {
    return (
      <div style={{ padding: 30, fontFamily: 'Arial, sans-serif' }}>
        <h2>Invalid or missing destination</h2>
        <p>No destination URL provided. Make sure &quot;u&quot; query param is present.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'Arial, sans-serif',
      background: '#f6fbff'
    }}>
      <div style={{
        maxWidth: 620,
        width: '100%',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        background: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ marginTop: 0 }}>Open in Browser</h2>
        <p style={{ color: '#444' }}>
          {isEmbeddedBrowser()
            ? 'It looks like you opened this link inside an app. Tap the button below to open the destination in your browser.'
            : 'We opened the link in a new tab for you.'}
        </p>

        <div style={{ margin: '18px 0' }}>
          <button
            onClick={() => {
              try {
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
              } catch {
                try { window.location.href = finalUrl; } catch {}
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
        </div>

        <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
          <p style={{ marginBottom: 8 }}>Or copy this URL and open it in Chrome / Safari:</p>
          <div style={{
            background: '#fafafa',
            padding: '10px',
            borderRadius: 6,
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: 12
          }}>
            {finalUrl}
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(finalUrl);
                alert('URL copied to clipboard');
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
            If this page does not open your browser automatically, use the button above or copy/paste the URL.
          </p>
        )}
      </div>
    </div>
  );
}
