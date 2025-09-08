import React, { useState } from 'react';
import './App.css';

// Configuration - Vedantu Channel for Harsh Priyam Master Teacher
const YOUTUBE_CHANNEL_ID = 'UC91RZv71f8p0VV2gaFI07pg';
const YOUTUBE_CHANNEL_NAME = 'Harsh Priyam - Vedantu Master Teacher';
const YOUTUBE_SUBSCRIBE_URL = 'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1';
const PDF_DOWNLOAD_URL = 'https://vdnt.in/short?q=H2a8P';

function App() {
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribeClick = () => {
    // Open YouTube channel for subscription
    window.open(YOUTUBE_SUBSCRIBE_URL, '_blank');
    
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
    window.open(PDF_DOWNLOAD_URL, '_blank');
    
    setTimeout(() => {
      setIsDownloading(false);
      setMessage('PDF download opened in new tab!');
    }, 1000);
  };


  return (
    <div className="App">
      <div className="hero">
        <div className="container">
          <h1>Harsh Priyam - Vedantu Master Teacher</h1>
          <p>Subscribe to get exclusive educational content and resources</p>
        </div>
      </div>

      <div className="container">
        <div className="simple-layout">
          <div className="main-card">
            <div className="card-header">
              <h2>📚 Get Your Free PDF Resource</h2>
              <p>Subscribe to Harsh Priyam's YouTube channel and download exclusive study material</p>
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

            <div className="instructions">
              <p><strong>How it works:</strong></p>
              <ol>
                <li>Click "Subscribe to Channel" - it will open YouTube</li>
                <li>Subscribe to Harsh Priyam's channel</li>
                <li>Come back and click "Download PDF"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
