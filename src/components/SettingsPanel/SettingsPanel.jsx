import React from 'react';
import './SettingsPanel.css';

const SettingsPanel = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null; // Don't render if not open
  }

  const handleClearHistory = () => {
    console.log('Clear History clicked');
    // Placeholder: Add actual history clearing logic here
    alert('History clearing not implemented yet.');
  };

  const handleThemeChange = (event) => {
    console.log('Theme change:', event.target.value);
    // Placeholder: Add actual theme changing logic here
    alert('Theme changing not implemented yet.');
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside panel */}
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose} aria-label="Close Settings">
            &amp;times; {/* Simple 'X' icon */}
          </button>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label htmlFor="theme-select">Theme:</label>
            <select id="theme-select" onChange={handleThemeChange} defaultValue="light">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Conversation History:</label>
            <button onClick={handleClearHistory}>Clear All History</button>
          </div>
          {/* Add more settings options here */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;