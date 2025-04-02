import { useState, useRef, useEffect } from 'react'; // Add useRef and useEffect
import './App.css';
import ChatInput from './components/ChatInput/ChatInput';
import HistorySidebar from './components/HistorySidebar/HistorySidebar';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';

function App() {
  const [streamingResponse, setStreamingResponse] = useState(''); // State for the single response string
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(''); // Store the query that generated the response

  const [history, setHistory] = useState([]); // State for conversation history
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Ref for the response display area - CORRECT PLACEMENT
  const responseAreaRef = useRef(null);

  const toggleSettingsPanel = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSendQuery = async (query) => {
    if (!query.trim()) return;

    setCurrentQuery(query); // Store the query
    setStreamingResponse(''); // Clear previous response
    setIsLoading(true);
    setError(null);

    // Add query to history
    const newHistoryItem = {
      id: Date.now(), // Simple unique ID using timestamp
      title: query,
      timestamp: new Date(),
    };
    setHistory(prevHistory => [newHistoryItem, ...prevHistory]); // Add to the beginning

    try {
      const response = await fetch('http://localhost:8000/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let accumulatedResponse = ''; // Accumulate the single response

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const lines = value.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6).trim();
            if (data === '[DONE]') {
              // Optionally handle the end signal
            } else if (data.startsWith('Error:')) {
               console.error("Backend Error:", data);
               setError(data);
               setIsLoading(false);
               return;
            } else {
              const decodedChunk = data.replace(/\\n/g, '\n');
              accumulatedResponse += decodedChunk;
              setStreamingResponse(accumulatedResponse); // Update the single response state
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch stream:', err);
      setError(`Failed to fetch response: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect for auto-scrolling
  useEffect(() => {
    // Use setTimeout to ensure scrolling happens after DOM update
    const timer = setTimeout(() => {
      if (responseAreaRef.current) {
        responseAreaRef.current.scrollTop = responseAreaRef.current.scrollHeight;
      }
    }, 0); // Delay of 0ms pushes execution to end of event loop

    return () => clearTimeout(timer); // Cleanup timer on unmount or before next effect run
  }, [streamingResponse]); // Run effect when streamingResponse changes

  const hasContent = isLoading || streamingResponse || error;

  return (
    <> {/* Use Fragment to avoid extra div */}
      <div className="app-layout"> {/* New outer container */}
        {/* Pass history state and toggle function */}
        <HistorySidebar history={history} onToggleSettings={toggleSettingsPanel} />
        <div className={`app-container ${hasContent ? 'has-content' : ''}`}> {/* Existing container becomes main content area */}
          {/* Display Area for Response/Error/Loading */}
          {/* Attach the ref to the scrollable div */}
          <div className="response-display-area" ref={responseAreaRef}>
            {error && <div className="error-message">{error}</div>}
            {isLoading && !streamingResponse && !error && <div className="loading-indicator">Waiting for response...</div>}
            {streamingResponse && !error && (
              <div className="response-content">
                 {/* Optionally display the query that generated this response */}
                 {/* <div className="response-query">Query: {currentQuery}</div> */}
                 <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>
                   {streamingResponse}
                 </pre>
              </div>
            )}
             {/* Placeholder for initial content or if no query has been made yet */}
             {!isLoading && !streamingResponse && !error && (
                <div className="placeholder-content">
                    {/* You could put initial instructions or content here */}
                </div>
             )}
          </div>

          {/* Input section remains at the bottom */}
          <div className="input-section">
             <h2 className="main-prompt-heading">What can I help with?</h2>
             <ChatInput onSendQuery={handleSendQuery} isLoading={isLoading} />
          </div>
        </div> {/* Close app-container */}
      </div> {/* Close app-layout */}

      {/* Render Settings Panel conditionally */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={toggleSettingsPanel} />
    </>
  );
}

export default App;
