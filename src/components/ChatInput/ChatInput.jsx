import React, { useState } from 'react';
import './ChatInput.css';
 
// Placeholder icons (replace with actual SVGs/icons)
const PlusIcon = () => <span>+</span>;
const SearchIcon = () => <span>🌐</span>; // Globe emoji as placeholder
const ReasonIcon = () => <span>💡</span>; // Lightbulb emoji as placeholder
const MoreIcon = () => <span>···</span>;
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0z"/>
  </svg>
);

// Remove SendIcon as it's replaced by MicIcon for sending
// const SendIcon = () => ( ... );

// Accept onSendQuery and isLoading as props
function ChatInput({ onSendQuery, isLoading }) {
  const [inputValue, setInputValue] = useState('');


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Remove callApi function, API call is handled in App.jsx

  // Handle sending the query
  const handleSend = () => {
    const query = inputValue.trim();
    if (query && !isLoading) { // Only send if not empty and not already loading
      onSendQuery(query); // Call the function passed from App.jsx
      setInputValue(''); // Clear the input field
    }
  };

  // Handle Enter key press in the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow Shift+Enter for newline
      event.preventDefault(); // Prevent default form submission/newline
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      {/* Left-side buttons */}
      <button className="chat-button icon-button plus-button" disabled={isLoading} title="Add context">
        <PlusIcon />
      </button>
      <button className="chat-button text-button search-button" disabled={isLoading} title="Search web">
        <SearchIcon /> Search
      </button>
      <button className="chat-button text-button reason-button" disabled={isLoading} title="Enable reasoning">
        <ReasonIcon /> Reason
      </button>
      <button className="chat-button icon-button more-button" disabled={isLoading} title="More options">
        <MoreIcon />
      </button>

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // Add key press handler
        placeholder="Ask anything" // Updated placeholder
        className="chat-input-field"
        disabled={isLoading} // Disable input while loading
      />

      {/* Right-side button (Mic/Send) */}
      <button
        onClick={handleSend}
        className="chat-button icon-button mic-button"
        disabled={isLoading || !inputValue.trim()} // Disable if loading or input is empty
        title="Send message or use voice input"
      >
        <MicIcon />
      </button>
    </div>

  );
}

export default ChatInput;