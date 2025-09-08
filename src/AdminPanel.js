import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ onLogout }) => {
  const [settings, setSettings] = useState({
    youtubeChannelId: 'UC91RZv71f8p0VV2gaFI07pg',
    youtubeChannelName: 'Harsh Priyam - Vedantu Master Teacher',
    youtubeSubscribeUrl: 'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1',
    pdfDownloadUrl: 'https://vdnt.in/short?q=H2a8P'
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Load session expiry
    const expiry = localStorage.getItem('adminSessionExpiry');
    if (expiry) {
      setSessionExpiry(parseInt(expiry));
    }
  }, []);

  const extendSession = () => {
    const newExpiry = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('adminSessionExpiry', newExpiry.toString());
    setSessionExpiry(newExpiry);
    setMessage('Session extended for 24 hours');
    setTimeout(() => setMessage(''), 3000);
  };

  const getSessionTimeRemaining = () => {
    if (!sessionExpiry) return 'Unknown';
    
    const now = new Date().getTime();
    const remaining = sessionExpiry - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleSave = () => {
    // Validate URLs
    if (!settings.youtubeSubscribeUrl.includes('youtube.com')) {
      setMessage('Please enter a valid YouTube URL');
      return;
    }
    
    if (!settings.pdfDownloadUrl.includes('http')) {
      setMessage('Please enter a valid PDF URL');
      return;
    }

    // Save to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    setIsEditing(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setSettings({
      youtubeChannelId: 'UC91RZv71f8p0VV2gaFI07pg',
      youtubeChannelName: 'Harsh Priyam - Vedantu Master Teacher',
      youtubeSubscribeUrl: 'https://www.youtube.com/channel/UC91RZv71f8p0VV2gaFI07pg?sub_confirmation=1',
      pdfDownloadUrl: 'https://vdnt.in/short?q=H2a8P'
    });
    setMessage('Settings reset to default');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <div className="admin-header-actions">
          <div className="session-info">
            <span>Session: {getSessionTimeRemaining()}</span>
            <button onClick={extendSession} className="extend-btn" title="Extend session by 24 hours">
              ⏰ Extend
            </button>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="settings-card">
          <div className="settings-header">
            <h2>📝 Manage Settings</h2>
            <div className="settings-actions">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit Settings
                </button>
              ) : (
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className={`admin-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="youtubeChannelName">YouTube Channel Name</label>
              <input
                type="text"
                id="youtubeChannelName"
                name="youtubeChannelName"
                value={settings.youtubeChannelName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter channel name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="youtubeChannelId">YouTube Channel ID</label>
              <input
                type="text"
                id="youtubeChannelId"
                name="youtubeChannelId"
                value={settings.youtubeChannelId}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter channel ID (e.g., UC91RZv71f8p0VV2gaFI07pg)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="youtubeSubscribeUrl">YouTube Subscribe URL</label>
              <input
                type="url"
                id="youtubeSubscribeUrl"
                name="youtubeSubscribeUrl"
                value={settings.youtubeSubscribeUrl}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://www.youtube.com/channel/..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="pdfDownloadUrl">PDF Download URL</label>
              <input
                type="url"
                id="pdfDownloadUrl"
                name="pdfDownloadUrl"
                value={settings.pdfDownloadUrl}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://example.com/your-pdf.pdf"
              />
            </div>
          </div>

          <div className="settings-footer">
            <button onClick={handleReset} className="reset-btn">
              Reset to Default
            </button>
            <div className="settings-info">
              <p><strong>Note:</strong> Changes will be applied immediately to the main app.</p>
            </div>
          </div>
        </div>

        <div className="preview-card">
          <h3>👀 Preview</h3>
          <div className="preview-content">
            <p><strong>Channel:</strong> {settings.youtubeChannelName}</p>
            <p><strong>Subscribe URL:</strong> <a href={settings.youtubeSubscribeUrl} target="_blank" rel="noopener noreferrer">{settings.youtubeSubscribeUrl}</a></p>
            <p><strong>PDF URL:</strong> <a href={settings.pdfDownloadUrl} target="_blank" rel="noopener noreferrer">{settings.pdfDownloadUrl}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
