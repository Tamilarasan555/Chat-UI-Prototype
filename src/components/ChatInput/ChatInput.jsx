import React, { useState } from 'react';
import './ChatInput.css';

// Updated placeholder icons for closer visual match
const PlusIcon = () => <span>+</span>;
const SearchIcon = () => <span>🌐</span>; // Globe emoji
const ReasonIcon = () => <span>💡</span>; // Lightbulb emoji
const MoreIcon = () => <span>···</span>; // Using three middle dots for '...'
// Using antenna bars as a placeholder for the mic icon - an SVG would be ideal for perfect match
const MicIcon = () => <span style={{ fontSize: '1.2em', fontWeight: 'bold', display: 'inline-block', transform: 'rotate(90deg)' }}>📶</span>;

function ChatInput() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = (buttonName) => {
    console.log(`${buttonName} button clicked`);
    // Add specific logic for each button here if needed
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="| Ask anything" // Added vertical bar to placeholder
        className="chat-input-field"
      />
      <div className="chat-input-buttons">
        {/* Added specific class for styling '+' button */}
        <button onClick={() => handleButtonClick('Add')} className="chat-button icon-button plus-button">
          <PlusIcon />
        </button>
        <button onClick={() => handleButtonClick('Search')} className="chat-button">
          <SearchIcon /> Search
        </button>
        <button onClick={() => handleButtonClick('Reason')} className="chat-button">
          <ReasonIcon /> Reason
        </button>
        {/* Added specific class for styling '...' button */}
        <button onClick={() => handleButtonClick('More')} className="chat-button icon-button more-button">
          <MoreIcon />
        </button>
      </div>
      <button onClick={() => handleButtonClick('Mic')} className="chat-button mic-button">
        <MicIcon />
      </button>
    </div>
  );
}

export default ChatInput;