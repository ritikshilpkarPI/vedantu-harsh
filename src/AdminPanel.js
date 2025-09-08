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
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [allConfigs, setAllConfigs] = useState([]);

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
    
    // Load all configurations
    const configs = localStorage.getItem('allConfigurations');
    if (configs) {
      setAllConfigs(JSON.parse(configs));
    }
  }, []);

  // Generate secure, obfuscated URL with embedded config
  const generateSecureUrl = (config) => {
    // Create a compact config object
    const compactConfig = {
      c: config.youtubeChannelId,
      n: config.youtubeChannelName,
      s: config.youtubeSubscribeUrl,
      p: config.pdfDownloadUrl
    };
    
    // Encode the configuration
    const configString = JSON.stringify(compactConfig);
    const encodedConfig = btoa(configString).replace(/[+/=]/g, (match) => {
      return {'+': '-', '/': '_', '=': ''}[match];
    });
    
    // Add some obfuscation
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    
    // Create the final URL ID with embedded config
    return `${random}${encodedConfig}${timestamp}`;
  };

  // Save configuration and generate URL
  const saveConfigurationAndGenerateUrl = () => {
    // Validate URLs
    if (!settings.youtubeSubscribeUrl.includes('youtube.com')) {
      setMessage('Please enter a valid YouTube URL');
      return;
    }
    
    if (!settings.pdfDownloadUrl.includes('http')) {
      setMessage('Please enter a valid PDF URL');
      return;
    }

    // Generate unique ID for this configuration
    const configId = generateSecureUrl(settings);
    const timestamp = new Date().toISOString();
    
    // Create configuration object
    const newConfig = {
      id: configId,
      ...settings,
      createdAt: timestamp,
      lastModified: timestamp
    };

    // Save to configurations list (for admin reference only)
    const updatedConfigs = [...allConfigs.filter(c => c.id !== configId), newConfig];
    setAllConfigs(updatedConfigs);
    localStorage.setItem('allConfigurations', JSON.stringify(updatedConfigs));
    
    // Generate the shareable URL
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/c/${configId}`;
    setGeneratedUrl(shareableUrl);
    
    setMessage(`Configuration saved! Shareable URL generated.`);
    setIsEditing(false);
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(''), 5000);
  };

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

  const handleSave = saveConfigurationAndGenerateUrl;

  const deleteConfiguration = (configId) => {
    const updatedConfigs = allConfigs.filter(c => c.id !== configId);
    setAllConfigs(updatedConfigs);
    localStorage.setItem('allConfigurations', JSON.stringify(updatedConfigs));
    setMessage('Configuration deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const loadConfiguration = (config) => {
    setSettings({
      youtubeChannelId: config.youtubeChannelId,
      youtubeChannelName: config.youtubeChannelName,
      youtubeSubscribeUrl: config.youtubeSubscribeUrl,
      pdfDownloadUrl: config.pdfDownloadUrl
    });
    setMessage('Configuration loaded for editing');
    setTimeout(() => setMessage(''), 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage('URL copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    }).catch(() => {
      setMessage('Failed to copy URL');
      setTimeout(() => setMessage(''), 3000);
    });
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

        {generatedUrl && (
          <div className="generated-url-card">
            <h3>🔗 Generated Shareable URL</h3>
            <div className="url-container">
              <input 
                type="text" 
                value={generatedUrl} 
                readOnly 
                className="generated-url-input"
              />
              <button 
                onClick={() => copyToClipboard(generatedUrl)} 
                className="copy-btn"
                title="Copy to clipboard"
              >
                📋 Copy
              </button>
            </div>
            <p className="url-note">Share this URL to give users access to this specific PDF configuration.</p>
          </div>
        )}

        <div className="configurations-card">
          <h3>📚 All Configurations</h3>
          {allConfigs.length === 0 ? (
            <p className="no-configs">No configurations created yet. Save your first configuration above!</p>
          ) : (
            <div className="configs-list">
              {allConfigs.map((config) => (
                <div key={config.id} className="config-item">
                  <div className="config-info">
                    <h4>{config.youtubeChannelName}</h4>
                    <p className="config-details">
                      <strong>PDF:</strong> {config.pdfDownloadUrl.length > 50 ? 
                        config.pdfDownloadUrl.substring(0, 50) + '...' : 
                        config.pdfDownloadUrl
                      }
                    </p>
                    <p className="config-meta">
                      Created: {new Date(config.createdAt).toLocaleDateString()}
                    </p>
                    <div className="config-url">
                      <strong>URL:</strong> 
                      <code>{window.location.origin}/c/{config.id}</code>
                      <button 
                        onClick={() => copyToClipboard(`${window.location.origin}/c/${config.id}`)} 
                        className="copy-btn-small"
                        title="Copy URL"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="config-actions">
                    <button 
                      onClick={() => loadConfiguration(config)} 
                      className="load-btn"
                      title="Load for editing"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => deleteConfiguration(config.id)} 
                      className="delete-btn"
                      title="Delete configuration"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
